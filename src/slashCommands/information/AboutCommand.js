const { MessageEmbed, version } = require('discord.js');
const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class AboutCommand extends BaseCommand {
    constructor() {
        super('about', {
            data: new SlashCommandBuilder()
                .setName('about')
                .setDescription('Небольшая информация о боте')
        })
    }

    async run(client, interaction) {
        const embed = new MessageEmbed()
            .setTitle('Немного о ' + client.user.username)
            .setThumbnail(client.user.avatarURL({ format: "png" }))
            .setDescription(`
**Matthews** - Пушистый музыкальный бот для вашего сервера.
Разработчик: **${client.users.cache.get(process.env.OWNERID).tag}**  
Текущая версия: **v${client.version}**
            `)
            .addField('Создан благодаря', `[Discord.js ${version}](https://discord.js.org/#/)\n[Node.js ${process.version}](https://nodejs.org/)`, true)
            .addField('Ссылки', '[Сервер поддержки](https://discord.gg/)', true)
            .setTimestamp(Date.now())
            .setFooter({ text: `${client.users.cache.get(process.env.OWNERID).username} Все права замурлыканы` })
            .setColor(client.colors.main);
        await interaction.reply({embeds: [embed]})
    }
}

module.exports = AboutCommand;
