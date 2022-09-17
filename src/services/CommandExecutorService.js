const { Formatters, Permissions } = require('discord.js');

class CommandExecutorService {
    constructor(message, client) {
        this.message = message;
        this.client = client || message.client;
        this.passed = false;
    }

    findCommand(name) {
        const command = this.client.commands.get(name);

        if (command) {
            return command;
        } else return this.client.commands.find(cmd => cmd.aliases.includes(name));
    }

    checkPerms(command) {
        //if (!permissions || permissions === []) return true;

        if (command.memberPermissions.length > 0 && command.memberPermissions.some((permission) => !this.message.member.permissions.has(permission))) {
            void this.client.replyError(this.message, 'У Вас недостаточно прав для использования команды. Необходимые права: **' + command.memberPermissions.map(r => this.client.constants.permissions[r]).join(', ') + '**');
            return this.passed = false;
        } else if (command.botPermissions.length > 0 && command.botPermissions.some((permission) => !this.message.guild.me.permissions.has(permission))) {
            void this.client.replyError(this.message, 'У бота недостаточно прав для использования команды. Необходимые права: **' + command.botPermissions.map(r => this.client.constants.permissions[r]).join(', ') + '**');
            return this.passed = false;
        } else this.passed = true;
    }

    async runCommand(prefix) {
        if (!this.message.content.startsWith(prefix) || this.message.author.bot || this.message.channel.type === 'DM') return;

        const [cmd, ...args] = this.message.content.slice(prefix.length).trim().split(/ +/g);
        const command = await this.findCommand(cmd);

        this.checkPerms(command);
        if (this.passed === false) return;

        if (command) {
            if (command.category === 'dev' && this.message.author.id !== process.env.OWNERID) return;
            try {
                await command.run(this.client, this.message, args);
                if (command.category !== 'dev') this.client.commandsUsed++;
            } catch (err) {
                console.error(err);
                if (command.debug === false) return;
                await this.client.replyError(this.message, 'Упс... Выполнение команды завершилось ошибкой:' + Formatters.codeBlock('js', err));
            }
        }
    }
}

module.exports = CommandExecutorService;
