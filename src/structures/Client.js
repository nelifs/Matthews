const { Client, Collection, Intents, MessageEmbed } = require('discord.js'),
    colors = require('../utils/misc/colors.json'),
    constants = require('../utils/misc/constants.json'),
    emojis = require('../utils/misc/emojis.json'),
    LoadSlashCommands = require('../services/LoadSlashCommands.js'),
    LoadListeners = require('../services/LoadListenersService');
require('dotenv').config();

module.exports = class extends Client {
    constructor() {
        super({
            shards: 'auto',
            allowedMentions: {
                parse: ['roles', 'users'],
                repliedUser: true
            },
            messageCacheLifetime: 200,
            messageCacheMaxSize: 20,
            messageEditHistoryMaxSize: 5,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES]
        });
        this.ping1d = 0;
        this.ping15m = 0;
        this.ping5m = 0;

        this.handledCommands1d = 0;
        this.handledCommands15m = 0;
        this.handledCommands5m = 0;

        this.listeners = new Collection();
        this.slashCommands = new Collection();
        this.devCommandsArray = [];
        this.commandsArray = [];
        this.debug = false;
        this.handledCommands = 0;
        this.prefix = process.env.prefix;
        this.token = process.env.DISCORD_TOKEN;
        this.constants = constants;
        this.colors = colors;
        this.customEmojis = emojis;
        this.version = require('../../package.json').version;
        this.lavalink = {
            minVolume: 0,
            maxVolume: 200,
            nodes: [
                {
                    name: 'Sierra',
                    url: process.env.LAVALINK_URL,
                    auth: process.env.LAVALINK_PASSWORD,
                    group: 'main',
                },
                {
                    name: 'Cloud',
                    url: process.env.LAVALINK_URL1,
                    auth: process.env.LAVALINK_PASSWORD1,
                    group: 'reserve',
                },
            ]
        };
        this.database = new (require('./Database'));
        this.logger = new (require('../utils/Logger'));
        this.functions = new (require('../utils/Functions'));
    }

    setColor() {
        if (this.user.username.includes('Dev')) {
            this.colors.main = '#6da0da'
        } else if (this.user.username.includes('Debug')) {
            this.colors.main = '#5bda82'
        }
    }

    async reply(message, title, content, edit, ephemeral) {
        try {
            const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(content)
                .setColor(this.colors.main);
            if (edit === true) return message.editReply({ embeds: [embed], ephemeral: ephemeral  }).catch(console.error);
            else return message.reply({ embeds: [embed], ephemeral: ephemeral  }).catch(console.error);
        } catch (err) {
            console.error(err);
        }
    }

    async replyError(message, content, edit, ephemeral) {
        try {
            const embed = new MessageEmbed()
                .setTitle(this.customEmojis.no + ' Ошибка!')
                .setDescription(content)
                .setColor(this.colors.error);
            if (edit === true) return message.editReply({ embeds: [embed], ephemeral: ephemeral  }).catch(console.error);
            else return message.reply({ embeds: [embed], ephemeral: ephemeral  }).catch(console.error);
        } catch (err) {
            console.error(err);
        }
    }

    async replySuccess(message, content, edit, ephemeral) {
        try {
            const embed = new MessageEmbed()
                .setTitle(this.customEmojis.yes + ' Успешно!')
                .setDescription(content)
                .setColor(this.colors.success);
            if (edit === true) return message.editReply({ embeds: [embed], ephemeral: ephemeral  }).catch(console.error);
            else return message.reply({ embeds: [embed], ephemeral: ephemeral }).catch(console.error);
        } catch (err) {
            console.error(err);
        }
    }

    manageCommands(action, global, guildId) {
        if (action === 'delete' && global === false) return this.guilds.cache.get(guildId).commands.set([]).catch(console.error)
        else if (action === 'delete' && global === true) return this.application.commands.set([]);

        if (action === 'add' && global === false) return this.guilds.cache.get(guildId).commands.set(this.commandsArray).catch(console.error)
        else if (action === 'add' && global === true) return this.application.commands.set(this.commandsArray);
    }

    setupStatsWatch() {
        setInterval(() => {
            this.ping15m = this.ws.ping
            this.handledCommands15m = this.handledCommands
        }, 900000)
        setInterval(() => {
            this.ping5m = this.ws.ping
            this.handledCommands5m = this.handledCommands
        }, 300000)
        setInterval(() => {
            this.ping1d = this.ws.ping
            this.handledCommands1d = this.handledCommands
        }, 86400000)
    }

    async start(debug) {
        console.time();
        await this.logger.webhook.send(`——————————————————————————————————————————————————————————————————————————\n<t:${~~(Date.now()/1000)}:f> :: [Logger/INFO] Started Logging...`);
        this.debug = debug;
        process.on('uncaughtException', console.error);
        await LoadListeners(this, '../listeners');
        void await this.logger.send(`Listeners Loader`, `${this.listeners.size} listeners successfully loaded`);
        await this.database.connect()
        this.login()
            .then(async () => {
                this.setupStatsWatch();
                await this.logger.send('Attempting to log in...');
                await LoadSlashCommands(this, '../slashCommands');
                void await this.logger.send(`Slash Commands Loader`, `${this.slashCommands.size} slash commands successfully loaded`);
                await this.manageCommands('add', true);
                this.guilds.cache.get('895713087565484073').commands.set(this.devCommandsArray).catch(console.error)
                void await this.logger.send(`Slash Commands Loader`, `${this.slashCommands.size} slash commands successfully registered`);
                this.setColor();
            })
            .catch(console.error);
    }
};
