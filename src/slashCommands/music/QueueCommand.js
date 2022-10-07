const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class QueueCommand extends BaseCommand {
    constructor() {
        super('queue', {
            data: new SlashCommandBuilder()
                .setName('queue')
                .setDescription('Очередь проигрывания')
                .addIntegerOption(option =>
                    option.setName('страница')
                        .setDescription('Страница очереди')
                        .setRequired(false))
        });
    }

    async run(client, message) {
        const pageQ = message.options.getInteger('страница') ?? 0;
        const player = client.manager.players.get(message.guild.id);
        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const queue = player.queue;
        const embed = new MessageEmbed()
            .setTitle(`Очередь для ${message.guild.name}`)
            .setColor(client.colors.main);

        const multiple = 10;
        const page = pageQ.length && Number(pageQ) ? Number(pageQ) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);

        if (queue.current) embed.addField('Сейчас играет', `[${queue.current.title}](${queue.current.uri}) • ${client.functions.format(queue.current.length)}`);

        if (!tracks.length) embed.setDescription(`Треков ${page > 1 ? 'нет' : 'нет'}.`);
        else embed.setDescription(tracks.map((track, i) => `**${start + (++i)}** - [${track.title}](${track.uri}) • ${client.functions.format(track.length)}`).join('\n'));

        const maxPages = Math.ceil(queue.length / multiple);

        embed.setFooter({ text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}` });

        return message.reply({ embeds: [embed] });
    }
}

module.exports = QueueCommand;
