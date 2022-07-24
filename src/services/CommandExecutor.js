const { Formatters, Permissions } = require('discord.js');

class CommandExecutor {
    constructor(message, client) {
        this.message = message;
        this.client = client || message.client;
    }

    findCommand(name) {
        const command = this.client.commands.get(name);

        if (command) {
            return command;
        } else return this.client.commands.find(cmd => cmd.aliases.includes(name));
    }

    checkPerms() {
        return null;
    }

    async runCommand(prefix) {
        if (!this.message.content.startsWith(prefix) || this.message.author.bot || this.message.channel.type === 'DM') return;

        const [cmd, ...args] = this.message.content.slice(prefix.length).trim().split(/ +/g);
        const command = await this.findCommand(cmd);

        if (command) {
            if (command.category === "dev" && this.message.author.id !== process.env.OWNERID) return;

            try {
                await command.run(this.client, this.message, args)
            } catch(err) {
                console.error(err)
                await this.message.reply('Упс... Выполнение команды завершилось ошибкой:' + Formatters.codeBlock('js', err))
            }
        }
    }
}

module.exports = CommandExecutor;