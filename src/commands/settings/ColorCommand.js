const BaseCommand = require('../../structures/BaseCommand');

class ColorCommand extends BaseCommand {
    constructor() {
        super('set-color', {
            category: 'settings',
            description: 'Установить пользовательский цвет эмбедов для сервера',
            aliases: ['setcolor', 'color'],
            memberPermissions: ['MANAGE_GUILD'],
            usage: '<HEX/reset>',
            examples: ['#ffffff` — Установит белый цвет эмедов', 'reset` — Сбросит цвет эмбедов на стандартный']
        });
    }

    async run(client, message, args) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id })
        const color = args[0]

        if(color === 'reset') return await client.replySuccess(message, 'Цвет эмбедов успешно сброшен')
            && client.database.setOne('guilds', { id: message.guild.id },{ color: client.colors.main });
        if(!color) return client.reply(message, 'Цвет', 'Текущий цвет `' + guild.color + '`\nДля его смены пропишите `' + guild.prefix + 'color <HEX>`');
        if(!color.match(/#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/g)) return client.replyError(message, 'Цвет должен быть в формате HEX');

        await client.replySuccess(message, 'Цвет эмбедов успешно изменён `' + (!guild.color ? client.colors.main : guild.color) + '` >> `' + color + '`');
        client.database.setOne('guilds', { id: message.guild.id },{ color: color });
    }
}

module.exports = ColorCommand;
