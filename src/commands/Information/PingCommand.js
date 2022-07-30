const BaseCommand = require('../../structures/BaseCommand');

class PingCommand extends BaseCommand {
    constructor(props) {
        super('ping', {
            description: 'Понг',
            category: 'Information'
        });
    }

    async run(client, message, args) {
        const before = process.hrtime.bigint();
        const after = process.hrtime.bigint();
        const ping = (parseInt(after - before) / 1000000).toFixed(3);

        const sent = await message.reply(`Понг! 🏓\nWebsocket: **${client.ws.ping}ms**\nRoundtrip: **rt-1ms**\nDatabase: **${ping}ms**`)
        await sent.edit(sent.content.replace('rt-1', (sent.createdTimestamp - message.createdTimestamp).toString()))
    }
}

module.exports = PingCommand;
