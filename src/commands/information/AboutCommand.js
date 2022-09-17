const { MessageEmbed, version } = require('discord.js');
const BaseCommand = require('../../structures/BaseCommand');

class InfoCommand extends BaseCommand {
    constructor() {
        super('about', {
            description: 'Небольшая информация о боте',
            category: 'information',
        })
    }

    async run(client, message, args) {
        let voiceConnections = 0;
        client.guilds.cache.forEach(g => {if(g.me.voice.channelId !== null) voiceConnections++})
        const embed = new MessageEmbed()
            .setTitle('Немного о ' + client.user.username)
            .setThumbnail(client.user.avatarURL({ format: "png" }))
            .setDescription(`
**Matthews** - Многофункциональный бот для вашего сервера.
Разработчик: **${client.users.cache.get(process.env.OWNERID).tag}**  
Текущая версия: **v${client.version}**

Мой стандартный префикс **${process.env.DEFAULTPREFIX}**, но Вы можете его сменить использовав команду **prefix**.
            `)
            .addField('Создан благодаря', `[Discord.js ${version}](https://discord.js.org/#/)\n[Node.js ${process.version}](https://nodejs.org/)`, true)
            .addField('Ссылки', '[Сервер поддержки](https://discord.gg/bkEHnU4y)', true)
            .setTimestamp(Date.now())
            .setFooter({ text: `${client.users.cache.get(process.env.OWNERID).username} Все права замурлыканы` })
            .setColor(client.color)
        await message.reply({embeds: [embed]})
    }
}

module.exports = InfoCommand;
