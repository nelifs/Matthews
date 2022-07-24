/*const { Manager } = require('erela.js');
const client = require('../index');

module.exports = class extends Manager {
    constructor(guilds) {
        super({
            clientId: client.user.id,
            autoPlay: true,
            nodes: [
                {
                    id: 0,
                    name: 'Serene',
                    host: 'lavalink-replit.nelfis.repl.co',
                    port: 443,
                    password: 'myveryfirstandverybestlavalinkserver',
                    connectedAt: Date.now(),
                    secure: true
                }
            ],
            async send(id, payload) {
                const guild = await client.guilds.cache.get(id);
                if (guild) await guild.shard.send(payload);
            },
        });
    }
}*/