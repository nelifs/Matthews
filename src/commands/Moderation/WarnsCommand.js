const BaseCommand = require('../../structures/BaseCommand');
const {MessageEmbed} = require('discord.js');

class WarnsCommand extends BaseCommand {
    constructor() {
        super('warns-list', {
            category: 'Moderation',
            description: 'Список полученных участником предупреждений',
            aliases: ['warns']
        });
    }

    async run(client, message, args) {
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.mentions.repliedUser || message.author;
        /*const dbUser = await User.findOne({id: user.id});

        if(!dbUser || dbUser === undefined) {
            await User.create({
                id: user.id,
                guildId: message.guild.id
            });
        }*/

        // if(user === undefined) return message.error('Для просмотра/очистки предупреждений, нужно указать существующего пользователя')
        if(user.bot === true) return message.error()

        const embed = new MessageEmbed()
            .setTitle('Список предупреждений ' + user)
        /*.setFooter({text: `Количество предупреждений: ${dbUser.warns.length}`})
        .setColor(client.colors.main)
    for (let i = 0; i < dbUser.warns.length; i++) {
        const warn = dbUser.warns[i];
        embed.addField('Предупреждение #' + parseInt(i+1), `
Выдал: <@${warn.initiator}>
Причина: **${warn.reason}**
Время: **<t:${(warn.timestamp / 1000).toFixed(0)}:F>** **(<t:${(warn.timestamp / 1000).toFixed(0)}:R>)**
                `)
        if(i === 9) break;
    }*/
        await message.reply({embeds: [embed]})
    } // TODO сделать страницы и починить вообще команду.
}

module.exports = WarnsCommand;