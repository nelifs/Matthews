const BaseCommand = require('../../structures/BaseCommand');
const { MessageEmbed, Formatters } = require('discord.js');

class ServerCommand extends BaseCommand {
    constructor() {
        super('server', {
            description: 'Информация о текущем сервере',
            aliases: ['server-info', 'guild'],
            category: 'information',
            debug: false,
        });
    }

    async run(client, message, args) {
        const guild = message.guild

        //Возможности:
        // ${guild.features.map(r => Formatters.bold(client.constants.serverFeatures[r])).join(', ')}

        const embed = new MessageEmbed()
            .setThumbnail(guild.iconURL({ dynamic: true, format: 'png', size: 1024 }))
            .setAuthor({ name: 'Информация о ' + guild.name })
            .setDescription(`
${guild.description ? '> ' + guild.description : ''}          
            
Владелец: **${guild.members.cache.get(guild.ownerId)}** **(${guild.ownerId})**
Количество участников: **${guild.memberCount}**
Уровень модерации: **${client.constants.serverVerification[guild.verificationLevel]}**
Фильтр контента: **${client.constants.serverExplicitFilter[guild.explicitContentFilter]}**
Количество бустов: **${guild.premiumSubscriptionCount}**
Дата создания: **<t:${~~(guild.createdAt/1000)}:D> (<t:${~~(guild.createdAt/1000)}:R>)**
            `)
            .addField('Статусы', `
Онлайн: **${guild.members.cache.filter(r => r.presence?.status === 'online').size}**
Оффлайн: **${guild.members.cache.filter(r => r.presence?.status === 'offline').size}**
Не беспокоить: **${guild.members.cache.filter(r => r.presence?.status === 'dbd').size}**
Нет на месте: **${guild.members.cache.filter(r => r.presence?.status === 'idle').size}**
            `)
            .addField('Числа', `
Текстовых каналов: **${guild.channels.cache.filter(r => r.type === 'GUILD_TEXT').size}**
Голосовые каналов: **${guild.channels.cache.filter(r => r.type === 'GUILD_VOICE').size}**
Ролей: **${guild.roles.cache.size}**
Эмодзи: **${guild.emojis.cache.filter(r => r.animated === false).size}**
Анимированных эмодзи: **${guild.emojis.cache.filter(r => r.animated === true).size}**
            `)
            .setImage(guild.bannerURL({ size: 1024, dynamic: true }))
            .setFooter({ text: 'Айди: ' + guild.id })
            .setColor(client.color)

        await message.reply({embeds: [embed]})
    }
}

module.exports = ServerCommand;
