const { MessageEmbed, version } = require('discord.js');
const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class StatsCommand extends BaseCommand {
    constructor() {
        super('stats', {
            data: new SlashCommandBuilder()
                .setName('stats')
                .setDescription('Статистика бота')
        });
    }

    async run(client, interaction) {
        let voiceConnections = 0;
        client.guilds.cache.forEach(g => {if (g.me.voice.channelId !== null) voiceConnections++;});

        const embed = new MessageEmbed()
            .setTitle('Статистика')
            .setThumbnail(client.user.avatarURL({ format: 'png' }))
            .addFields([
                {
                    name: 'Основная', value: `
Запущен **<t:${~~(client.readyAt / 1000)}:R>**
Голосовых соединений: **${voiceConnections}**
Серверов: **${client.guilds.cache.size}**
Пользователей: **${client.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0)}**
Каналов: **${client.channels.cache.size}**
Эмодзи: **${client.emojis.cache.size}**
               `
                },
                {
                    name: 'Память', value: `
\` > \` Используется: **${client.functions.numberFormat(~~(process.memoryUsage().rss / 1024 ** 2), 0, '.', ',')} MB**
\` > \` Всего: **${client.functions.numberFormat(~~(require('os').totalmem() / 1024 ** 2), 0, '.', ',')} MB**
            `
                },
                {
                    name: 'Задержка API', value: `
\` > \` Сейчас: **${client.ws.ping}ms**
\` > \` 5 мин: **${client.ping5m}ms**
\` > \` 15 мин: **${client.ping15m}ms**
            `
                },
                {
                    name: 'Обработано команд', value: `
\` > \` Сейчас: **${client.handledCommands}**
\` > \` 5 мин: **${client.handledCommands5m}**
\` > \` 15 мин: **${client.handledCommands15m}**
            `
                }, /*{
                    name: 'Шарды', value: `
Кол-во шардов: ${client.shard.count}
${pingStr}
                    `
                }*/])
            .setFooter({ text: `${client.users.cache.get(process.env.OWNERID).username} Все права замурлыканы` })
            .setColor(client.colors.main);
        await interaction.reply({ embeds: [embed] });
    }
}

module.exports = StatsCommand;
