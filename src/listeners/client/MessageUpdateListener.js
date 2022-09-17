const BaseListener = require('../../structures/BaseListener');
const CommandExecutor = require('../../services/CommandExecutorService');

const {Formatters} = require('discord.js');


class MessageUpdateListener extends BaseListener {
    constructor() {
        super('MessageCreate', {event: 'messageUpdate'});
    }

    async run(client, oldMessage, newMessage) {
        if (!newMessage.guild || oldMessage.content === newMessage.content) return;
        if (newMessage.author.bot) return;

        const guild = client.database.findOne('guilds', { id: newMessage.guild.id });

        if(!guild) client.database.insert('guilds', [{ id: newMessage.guild.id, prefix: 'm!' }])

        const prefix = guild.prefix;

        const executor = new CommandExecutor(newMessage, client);
        return executor.runCommand(prefix);
    }
}

module.exports = MessageUpdateListener;
