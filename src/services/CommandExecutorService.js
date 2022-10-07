const { Formatters, Permissions } = require('discord.js');

class CommandExecutorService {
    constructor(message, client) {
        this.message = message;
        this.client = client || message.client;
    }

    findCommand(name) {
        let command;

        command = this.client.slashCommands.get(name);
        return command;
    }

    async runCommand() {
        try {
            const command = await this.findCommand(this.message.commandName);
            await command.run(this.client, this.message);
            this.client.handledCommands++
        } catch(err) {
            this.client.handledErrors++
        }
    }
}

module.exports = CommandExecutorService;
