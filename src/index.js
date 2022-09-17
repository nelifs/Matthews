const MatthewsClient = require('./structures/Client');
const client = new MatthewsClient();

const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const Spotify = require('kazagumo-spotify');

client.start().catch(console.error)

client.manager = new Kazagumo({
    moveOnDisconnect: true,
    resumable: false,
    resumableTimeout: 30,
    retryTimeout: 30000,
    reconnectTries: 10000,
    restTimeout: 10000,
    plugins: [
        new Spotify({
            clientId: '2ac4adfed5cc47cebf2a874dfa71b3d0',
            clientSecret: 'f2404af85a134dacb4743060f11c1a3e',
            playlistPageLimit: 1,
            albumPageLimit: 1,
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

process.on('uncaughtException', console.error);
process.on('uncaughtRejection', console.error);
process.on('warning', console.error);
