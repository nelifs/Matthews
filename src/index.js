const MatthewsClient = require('./structures/Client');
const client = new MatthewsClient();

const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const Spotify = require('kazagumo-spotify');

client.start(false).catch(console.error)

client.manager = new Kazagumo({
    moveOnDisconnect: true,
    resumable: false,
    resumableTimeout: 30,
    retryTimeout: 30000,
    reconnectTries: 10000,
    restTimeout: 10000,
    defaultSearchEngine: 'soundcloud',
    plugins: [
        new Spotify({
            clientId: '',
            clientSecret: '',
            playlistPageLimit: 7,
            albumPageLimit: 7,
            searchLimit: 10,
            searchMarket: 'US',
        }),
    ],
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), client.lavalink.nodes);

module.exports = client;

process.on('SIGINT', () => client.logger.webhook.send(`<t:${~~(Date.now()/1000)}:f> :: [Logger/INFO] Process exited. Logging disabled...\n——————————————————————————————————————————————————————————————————————————`))
process.on('uncaughtException', err => client.logger.error('Main thread', err));
process.on('uncaughtRejection', err => client.logger.error('Main thread', err));
process.on('warning', err => client.logger.warn('Main thread', err));
