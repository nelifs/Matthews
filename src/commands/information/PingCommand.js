const BaseCommand = require('../../structures/BaseCommand');

class PingCommand extends BaseCommand {
    constructor(props) {
        super('ping', {
            description: 'Понг',
            category: 'information'
        });
    }

    async run(client, message, args) {
        const before = process.hrtime.bigint();

        client.database.findAll('guilds', {});
        client.database.findAll('users', {});

        const after = process.hrtime.bigint();
        const ping = (parseInt(after - before) / 1000000).toFixed(2);

        //Roundtrip: **rt-1ms**
        const sent = await client.reply(message, `Понг! 🏓`, `\nWebsocket: **${client.ws.ping}ms**\nDatabase: **${ping}ms**`)
        //await sent.edit(sent.embeds[0].description.replace('rt-1', (sent.createdTimestamp - message.createdTimestamp).toString()))
    }
}

module.exports = PingCommand;
