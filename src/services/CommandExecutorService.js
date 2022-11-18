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
            if (command.dir === 'dev' && this.message.user.id !== process.env.OWNERID) return;
            if (command.dir === 'music') {
                const guild = await this.client.database.findOne('guilds', { id: this.message.guild.id });

                if (!this.message.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                    if (guild.djPerms.includes(command.name)) return this.client.replyError(this.message, 'Вы не можете использовать команду **' + command.name + '** из-за настройки прав.', false, true);
                }
            }
            await command.run(this.client, this.message).catch(err => {
                const token = this.client.functions.generateToken(15, false);
                this.message.reply({ content: 'Ошибка выполнения команды.\nКод ошибки: \`' + token + '\`', ephemeral: true });
                this.client.logger.error('Error code: ' + token + '\n' + err.stack);
                this.client.handledErrors++;
            });
            this.client.handledCommands++;
        } catch (err) {
            const token = this.client.functions.generateToken(15, false);
            this.message.reply({ content: 'Ошибка выполнения команды.\nКод ошибки: \`' + token + '\`', ephemeral: true });
            this.client.logger.error('Error code: ' + token + '\n' + err.stack);
            this.client.handledErrors++;
        }
    }
}

module.exports = CommandExecutorService;
