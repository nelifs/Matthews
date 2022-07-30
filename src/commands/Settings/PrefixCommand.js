const BaseCommand = require('../../structures/BaseCommand');

class PrefixCommand extends BaseCommand {
    constructor() {
        super('set-prefix', {
            category: 'Settings',
            description: 'Установить пользовательский префикс для сервера',
            aliases: ['setprefix', 'prefix']
        });
    }

    async run(client, message, args) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id })

        if(!args[0]) return message.reply('Текущий префикс `' + guild.prefix + '`\nДля его смены пропишите `' + guild.prefix + 'prefix <символ>`');
        if(args[0].length > 3) return message.error('Максимальная длина префикса `3`');

        await message.success('Префикс сервера успешно изменён `' + guild.prefix + '` >> `' + args[0] + '`');
        client.database.setOne('guilds', { id: message.guild.id },{ prefix: args[0] });
    }
}

module.exports = PrefixCommand;