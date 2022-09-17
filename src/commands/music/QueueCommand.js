const BaseCommand = require('../../structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

class QueueCommand extends BaseCommand {
    constructor() {
        super('queue', {
            category: 'music',
            aliases: ['q', 'й', 'йгугу'],
            description: 'Очередь треков добавленных участниками',
            usage: '<страница>',
            examples: ['3` — Покажет 3 страницу очереди']
        });
    }

    async run(client, message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return client.replyError(message, "Активных плееров нет");

        const queue = player.queue;
        const embed = new MessageEmbed()
            .setTitle(`Очередь для ${message.guild.name}`)
            .setColor(client.color);

        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);

        if(queue.current) embed.addField('Сейчас играет', `[${queue.current.title}](${queue.current.uri}) • ${client.functions.format(queue.current.length)}`);

        if(!tracks.length) embed.setDescription(`Треков ${page > 1 ? 'нет' : 'нет'}.`);
        else embed.setDescription(tracks.map((track, i) => `**${start + (++i)}** - [${track.title}](${track.uri}) • ${client.functions.format(track.length)}`).join("\n"));

        const maxPages = Math.ceil(queue.length / multiple);

        embed.setFooter({text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}`});

        return message.reply({embeds: [embed]});
    }
}

module.exports = QueueCommand;
