const BaseCommand = require('../../structures/BaseCommand');

class PrefixCommand extends BaseCommand {
    constructor() {
        super('set-prefix', {
            category: 'settings',
            description: 'Установить пользовательский префикс для сервера',
            aliases: ['setprefix', 'prefix'],
            memberPermissions: ['MANAGE_GUILD', 'ADMINISTRATOR'],
            usage: '<префикс>',
            examples: ['m.`\nУстановит префикс `m.`']
        });
    }

    async run(client, message, args) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id })

        if(!args[0]) return client.reply(message, 'Префикс', 'Текущий префикс **' + guild.prefix + '**\nДля его смены пропишите `' + guild.prefix + 'prefix <символ>`');
        if(args[0].length > 3) return client.replyError(message, 'Максимальная длина префикса `3`');

        await client.replySuccess(message, 'Префикс сервера успешно изменён `' + guild.prefix + '` >> `' + args[0] + '`');
        client.database.setOne('guilds', { id: message.guild.id },{ prefix: args[0] });
    }
}

module.exports = PrefixCommand;
