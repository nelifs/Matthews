const {Client, Collection, Intents} = require('discord.js'),
    {Manager} = require('erela.js'),
    colors = require('../utils/misc/colors.json'),
    emojis = require('../utils/misc/emojis.json'),
    utils = require('../utils/Functions'),
    LoadCommands = require('../helpers/LoadCommands'),
    LoadListeners = require('../helpers/LoadListeners');
    require('dotenv').config();

module.exports = class extends Client {
    constructor() {
        super({
            shards: "auto",
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: true
            },
            messageCacheLifetime: 200,
            messageCacheMaxSize: 20,
            messageEditHistoryMaxSize: 5,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
            // intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
        });

        this.listeners = new Collection();
        this.commands = new Collection();
        this.mutes = new Collection();
        this.activePlayers = new Collection();
        this.prefix = process.env.prefix;
        this.colors = colors;
        this.customEmojis = emojis;
        this.version = require('../../package.json').version;
        this.token = process.env.CLIENTTOKEN
        this.categories = [];
        /*this.lavalink = {
            minVolume: 0,
            maxVolume: 1000,
            nodes: [
                {
                    id: 0,
                    name: 'Serene',
                    host: 'lavalink-replit.nelfis.repl.co',
                    port: 443,
                    password: process.env.LAVALINKPASS,
                    connectedAt: Date.now(),
                    secure: true
                },
            ]
        }*/
        this.database = new (require('./Database'));
        this.logger = new (require('../utils/Logger'));
        this.functions = new (require('../utils/Functions'));
    }

    async start() {
        process.on('uncaughtException', console.error);
        process.on('uncaughtRejection', console.error);
        process.on('warning', console.error);

        await LoadListeners(this, '../listeners');
        await LoadCommands(this, '../commands');
        this.login().then(async () => await this.logger.send('Attempting to log in...')).catch(this.logger.error);
        await this.database.connect()
    }
}