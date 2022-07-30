const { MessageEmbed, version } = require('discord.js');
const BaseCommand = require('../../structures/BaseCommand');

class InfoCommand extends BaseCommand {
    constructor() {
        super('info', {
            description: 'Информация и состояние бота',
            category: 'Information',
            aliases: ['botinfo', 'bot-info']
        })
    }

    async run(client, message, args) {
        let embed = new MessageEmbed()
            .setTitle('Информация')
            .setThumbnail(client.user.avatarURL({ format: "png" }))
            .addField("Основная", `
Запущен **<t:${(client.readyAt/1000).toFixed(0)}:R>**
Версия: **${client.version}**
Discord.js **v${version}**
NodeJS **${process.version}**
`)
            .addField("Статистика", `
Серверов: **${client.guilds.cache.size}**
Пользователей: **${client.users.cache.size}/${client.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0)}**
ОЗУ: **${(process.memoryUsage().heapUsed / 1024 ** 2).toFixed(2)} MB :: ${(process.memoryUsage().rss / 1024 ** 2).toFixed(2) } MB**
`)
            .setTimestamp(Date.now())
            .setFooter({ text: `${client.users.cache.get(process.env.OWNERID).username} Все права замурлыканы` })
            .setColor(client.colors.main)
        await message.reply({embeds: [embed]})
    }
}

module.exports = InfoCommand;