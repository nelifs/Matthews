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
                parse: ['roles', 'users', 'everyone'],
                repliedUser: true
            },
            messageCacheLifetime: 200,
            messageCacheMaxSize: 20,
            messageEditHistoryMaxSize: 5,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_BANS]
            // intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
        });

        this.listeners = new Collection();
        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.commandsArray = [];
        this.debug = false;
        this.handledCommands = 0;
        this.handledErrors = 0;
        this.prefix = process.env.prefix;
        this.constants = constants;
        this.colors = colors;
        this.customEmojis = emojis;
        this.version = require('../../package.json').version;
        this.categories = [];
        this.lavalink = {
            minVolume: 0,
            maxVolume: 200,
            nodes: [
                /*{
                    name: 'Sierra',
                    url: process.env.LAVALINK_URL,
                    auth: process.env.LAVALINK_PASSWORD,
                    group: 'main',
                },*/
                {
                    name: 'Darling',
                    url: process.env.LAVALINK_URL1,
                    auth: process.env.LAVALINK_PASSWORD1,
                    group: 'reserve',
                    secure: true,
                },
            ]
        };
        this.database = new (require('./Database'));
        this.logger = new (require('../utils/Logger'));
        this.functions = new (require('../utils/Functions'));
    }

    async destroyAllPlayers(deleteIfPaused) {
        this.manager.players.forEach(r => {
            if (deleteIfPaused === true) r.destroy();
            else if (deleteIfPaused === false && r.paused === true) r.destroy();
        });
        await this.logger.send('MusicManager', `Successfully deleted all ${deleteIfPaused === true ? '' : 'paused '}players`);
    }

    async deletePlayerTempInformation(player) {
        if (player === 'all') {
            this.guilds.cache.forEach(r => {
                const player = this.manager.players.get(r.id);
                console.log(player);
                clearInterval(player.data.get('interval'));
            });
        } else {
            clearInterval(player.data.get('interval'));
            player.data.delete('messageVoice');
            player.data.delete('message');
            player.data.delete('interval');
            await this.logger.send('MusicManager', 'Successfully deleted all temporary information in ' + player.guildId);
        }
    }

    async reply(message, title, content) {
        try {
            const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(content)
                .setColor(this.colors.main);
            return message.reply({ embeds: [embed] }).catch(console.error);
        } catch (err) {
            console.error(err);
        }
    }

    async replyError(message, content) {
        try {
            const embed = new MessageEmbed()
                .setTitle(this.customEmojis.no + ' Ошибка!')
                .setDescription(content)
                .setColor(this.colors.error);
            return message.reply({ embeds: [embed] }).catch(console.error);
        } catch (err) {
            console.error(err);
        }
    }

    async replySuccess(message, content) {
        try {
            const embed = new MessageEmbed()
                .setTitle(this.customEmojis.yes + ' Успешно!')
                .setDescription(content)
                .setColor(this.colors.success);
            return message.reply({ embeds: [embed] }).catch(console.error);
        } catch (err) {
            console.error(err);
        }
    }

    async start(debug) {
        console.time();
        this.debug = debug;
        process.on('uncaughtException', console.error);
        await LoadListeners(this, '../listeners');
        void await this.logger.send(`Listeners Loader`, `${this.listeners.size} listeners successfully loaded`);
        //await LoadCommands(this, '../commands');
        //void await this.logger.send(`Commands Loader`, `${this.commands.size} commands successfully loaded`);
        await this.database.connect();
        this.login()
            .then(async () => {
                await this.logger.send('Attempting to log in...');
                await LoadSlashCommands(this, '../slashCommands');
                void await this.logger.send(`Slash Commands Loader`, `${this.slashCommands.size} slash commands successfully loaded`);
                //await this.guilds.cache.get('895713087565484073').commands.set(this.commandsArray);
                void await this.logger.send(`Slash Commands Loader`, `${this.slashCommands.size} slash commands successfully registered`);
            })
            .catch(console.error);
    }
};
