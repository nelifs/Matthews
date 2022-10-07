const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class PingCommand extends BaseCommand {
    constructor(props) {
        super('ping', {
            data: new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Понг!')
        });
    }

    async run(client, message) {
        const before = process.hrtime.bigint();

        client.database.findAll('guilds', {});
        client.database.findAll('users', {});

        const after = process.hrtime.bigint();
        const ping = (parseInt(after - before) / 1000000).toFixed(2);
        await client.reply(message, `Понг! 🏓`, `\nВебсокет: **${client.ws.ping}ms**\nБаза-данных: **${ping}ms**`)
    }
}

module.exports = PingCommand;
