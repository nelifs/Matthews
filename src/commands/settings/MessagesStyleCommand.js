const BaseCommand = require('../../structures/BaseCommand');

class MessagesStyleCommand extends BaseCommand {
    constructor() {
        super('set-messages-style', {
            category: 'settings',
            description: 'Установить стиль сообщений об ошибках/успешных операциях',
            aliases: ['setmessagesstyle', 'messages-style', 'messagesstyle'],
            memberPermissions: ['MANAGE_GUILD', 'ADMINISTRATOR'],
            usage: '<embed/text>',
            examples: ['embed`\nУстановит стиль на эмбеды', 'text`\nУстановит стиль на компактный, только текст и эмодзи']
        });
    }

    async run(client, message, args) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id })

        if(!args[0]) return client.reply(message, 'Стиль сообщений', 'Текущий стиль **' + guild.messagesStyle + '**\nДля его смены пропишите `' + guild.prefix + 'set-messages-style <символ>`');

        async function change() {
            await client.replySuccess(message, 'Стиль сообщений об успешных операциях/ошибках успешно изменён `' + (!guild.messagesStyle ? 'text' : guild.messagesStyle) + '` >> `' + args[0] + '`');
            client.database.setOne('guilds', { id: message.guild.id },{ messagesStyle: args[0] });
        }

        if (args[0] === 'embed') return change()
        else if (args[0] === 'text') return change()
        else return client.reply(message, 'Стиль сообщений', 'Для переключения стиля введите:\n**text** — Сообщения без эмбедов, компактные и красивые\n**embed** — Эмбеды, более громоздкие, но также красивые');
    }
}

module.exports = MessagesStyleCommand;
