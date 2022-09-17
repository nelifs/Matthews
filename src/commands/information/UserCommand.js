const BaseCommand = require('../../structures/BaseCommand');
const { MessageEmbed, Formatters } = require('discord.js');

class UserCommand extends BaseCommand {
    constructor() {
        super('user', {
            description: 'Информация о указанном пользователе',
            aliases: ['u', 'whois'],
            category: 'information',
            usage: '<айди/упоминание>',
            examples: ['@Matthews` — Покажет информацию о Matthews']
        });
    }

    async run(client, message, args) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.mentions.repliedUser || message.author;
        const member = message.guild.members.cache.get(user.id);

        const dbUser = await client.database.findOne('users', { guildId: message.guild.id, id: user.id });
        const dbGuild = await client.database.findOne('guilds', { id: message.guild.id });

        const embed = new MessageEmbed()
            .setThumbnail(member.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setAuthor({ name: user.tag, iconURL: user.avatarURL({ dynamic: true }) });
        if (dbUser?.bio) {
            embed.setDescription('> ' + dbUser.bio.substr(0, 512));
        }

        //${member.presence.activities ? '\n' + member.presence.activities.map(r => `**${r.name}**
        // ${r.details ? r.details + ' — ' : ''}${r.state ? r.state + '\n' : ''}<t:${~~(r.createdTimestamp/1000)}:R>`).join('\n') : ''}

        embed.addField('Информация', `
${user.flags?.toArray() ? user.flags?.toArray().map((r) => `${client.customEmojis.flags[r]} `).join('  ').replace('undefined', '**Неизвестный значок**') : ''}
Айди: **${user.id}**
Последнее сообщение: **${dbUser?.lastMessageTimestamp ? `${dbUser?.lastMessageContent.length > 256 ? dbUser?.lastMessageContent.substr(0, 256) + '...' : dbUser?.lastMessageContent} (<t:${~~(dbUser?.lastMessageTimestamp / 1000)}:R>)` : 'Неизвестно'}**

Дата регистрации: **${Formatters.time(~~(user.createdAt / 1000), 'D')}** **${Formatters.time(~~(user.createdAt / 1000), 'R')}**
Дата присоединения: **${Formatters.time(~~(member.joinedAt / 1000), 'D')}** **${Formatters.time(~~(member.joinedAt / 1000), 'R')}**
            `)
        /*if (dbGuild.levelsEnabled === true) embed.addField('Система уровней', `
Уровень: **${dbUser.level}**
Опыт: **${dbUser.currentXp}/${dbUser.xpToNextLevel}**
        `)*/
        embed.setImage(!await user ? null : (await user.fetch()).bannerURL({ dynamic: true, size: 1024 }));
        embed.setColor(member.displayHexColor);

        await message.reply({ embeds: [embed] });
    }
}

module.exports = UserCommand;
