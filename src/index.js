const MatthewsClient = require('./structures/Client');
const client = new MatthewsClient();

const { Manager } = require('erela.js');

client.start().catch(console.error)

const nodes = [
        {
            id: 0,
            name: 'Serene',
            host: 'lavalink-replit.nelfis.repl.co',
            port: 443,
            password: 'myveryfirstandverybestlavalinkserver',
            connectedAt: Date.now(),
            secure: true
        }
    ]

client.manager = new Manager({
    nodes,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if(guild) guild.shard.send(payload).catch(console.error);
    }
});


module.exports = client;

process.on('uncaughtException', console.error);
process.on('uncaughtRejection', console.error);
process.on('warning', console.error);
