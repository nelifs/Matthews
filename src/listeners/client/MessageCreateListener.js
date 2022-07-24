const BaseListener = require('../../structures/BaseListener');
const CommandExecutor = require('../../services/CommandExecutor');


class MessageCreateListener extends BaseListener {
    constructor() {
        super('MessageCreate', {event: 'messageCreate'});
    }

    async run(client, message) {
        if (message.author.bot) return;

        const guild = await client.database.findOne('guilds', { id: message.guild.id })

        if(!guild) {
            client.database.insert('guilds', [{id: message.guild.id, prefix: 'm!'}])
        }

        const prefix = guild.prefix;

        if (message.content.startsWith('<@' + client.user.id + '>' || '<!@' + client.user.id + '>')) {
            await message.reply('Привет! Мой префикс на этом сервере: `' + prefix + '`\nДля получения полного списка команд пропишите `' + prefix + 'help`')
        }

        const executor = new CommandExecutor(message, client);
        return executor.runCommand(prefix);
    }
}

module.exports = MessageCreateListener;