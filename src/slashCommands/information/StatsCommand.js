const { MessageEmbed, version } = require('discord.js');
const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class StatsCommand extends BaseCommand {
    constructor() {
        super('stats', {
            data: new SlashCommandBuilder()
                .setName('stats')
                .setDescription('Статистика бота')
        })
    }

    async run(client, message) {
        let voiceConnections = 0;
        client.guilds.cache.forEach(g => {if(g.me.voice.channelId !== null) voiceConnections++})
        const embed = new MessageEmbed()
            .setTitle('Статистика')
            .setThumbnail(client.user.avatarURL({ format: "png" }))
            .addFields([
                { name: "Основная", value: `
Запущен **<t:${~~(client.readyAt/1000)}:R>**
Голосовых соединений: **${voiceConnections}**
Серверов: **${client.guilds.cache.size}**
Пользователей: **${client.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0)}**
               `},
                { name: "Сервер", value: `
Обработано команд: **${client.handledCommands}**
Задержка: **${client.ws.ping}ms**
ОЗУ: **${(process.memoryUsage().heapUsed / 1024 ** 2).toFixed(2)} MB :: ${(process.memoryUsage().rss / 1024 ** 2).toFixed(2) } MB**
            `}])
            .setTimestamp(Date.now())
            .setFooter({ text: `${client.users.cache.get(process.env.OWNERID).username} Все права замурлыканы` })
            .setColor(client.colors.main);
        await message.reply({embeds: [embed]})
    }
}

module.exports = StatsCommand;
