const { Message, MessageEmbed, APIMessage, MessagePayload } = require('discord.js');
const Emojis = require('../utils/misc/emojis.json');

class ExtendedMessage extends Message {

    error(options) {
        if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
        let data;

        if (options instanceof MessagePayload) {
            data = options;
        } else {
            data = MessagePayload.create(this, Emojis.no + ' ' + options, {
                reply: {
                    messageReference: this,
                    failIfNotExists: options?.failIfNotExists ?? this.client.options.failIfNotExists,
                },
            });
        }
        return this.channel.send(data);
    }

    success(options) {
        if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
        let data;

        if (options instanceof MessagePayload) {
            data = options;
        } else {
            data = MessagePayload.create(this, Emojis.yes + ' ' + options, {
                reply: {
                    messageReference: this,
                    failIfNotExists: options?.failIfNotExists ?? this.client.options.failIfNotExists,
                },
            });
        }
        return this.channel.send(data);
    }
}