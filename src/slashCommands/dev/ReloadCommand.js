const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Formatters } = require('discord.js');

class ReloadCommand extends BaseCommand {
    constructor() {
        super('reload', {
            public: false,
            data: new SlashCommandBuilder()
                .setName('reload')
                .setDescription('???')
        });
    }

    async run(client, message) {
        message.deferReply();
        try {
            client.slashCommands.forEach(cmd => {
                delete require.cache[require.resolve(`../${cmd.dir}/${cmd.fileName}`)];
                client.commands.delete(cmd.fileName);
                const pull = require(`../${cmd.dir}/${cmd.fileName}`);
                client.commands.set(cmd.fileName, pull);
            });

            client.manageCommands('add', false, '895713087565484073');

            await client.replySuccess(message, 'Все команды были перезагружены.');
        } catch (err) {
            console.error(err);
            await client.replyError(message, 'Ошибка перезагрузки команд\n' + Formatters.codeBlock('js', err));
        }
    }
}

module.exports = ReloadCommand;
