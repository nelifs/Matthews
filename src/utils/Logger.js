const moment = require('moment');
const format = 'L hh:mm:ss A';
const chalk = require('chalk');
const { WebhookClient, Formatters } = require('discord.js');

const log = chalk.green;
const error = chalk.bold.red;
const debug = chalk.yellow;
const warn = chalk.hex('#f57842');
const info = chalk.blueBright;

const webhook = new WebhookClient({ url: 'https://canary.discord.com/api/webhooks/1031640136116621383/08yPGbz8TcJTPnQoHTmBVgUD7RXY94TgA7Vtcuum-OxF1Isrq5qcXbZCSoMt8YaNmZFb' });

module.exports = webhook;

class Logger {
    constructor() {
        this.webhook = webhook;
    }


    async send(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(info(`${time} :: [${sys}/INFO]`) + ` ${message}`);
        await webhook.send(`<t:${~~(Date.now()/1000)}:f> :: [${sys}/INFO] ${message}`)
    }

    async error(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(error(`${time} :: [${sys}/ERROR]`) + ` ${message}`);
        await webhook.send(`<t:${~~(Date.now()/1000)}:f> :: [${sys}/ERROR] ${message}`)
    }

    async warn(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(warn(`${time} :: [${sys}/WARN]`) + ` ${message}`);
        await webhook.send(`<t:${~~(Date.now()/1000)}:f> :: [${sys}/WARN] ${message}`)
    }

    async debug(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(debug(`${time} :: [${sys}/DEBUG]`) + ` ${message}`);
        await webhook.send(`<t:${~~(Date.now()/1000)}:f> :: [${sys}/DEBUG] ${message}`)
    }
}

module.exports = Logger;
