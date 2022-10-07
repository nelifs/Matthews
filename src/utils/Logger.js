const moment = require('moment');
const format = 'L hh:mm:ss A';
const chalk = require('chalk');

const log = chalk.green;
const error = chalk.bold.red;
const debug = chalk.yellow;
const warn = chalk.hex('#f57842');
const info = chalk.blueBright;

class Logger {
    async send(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(info(`${time} :: [${sys}/INFO]`) + ` ${message}`);
    }

    async error(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(error(`${time} :: [${sys}/ERROR]`) + ` ${message}`);
    }

    async warn(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(warn(`${time} :: [${sys}/WARN]`) + ` ${message}`);
    }

    async debug(sys, message) {
        if(message === undefined) {
            message = sys;
            sys = 'Main thread';
        }
        const time = moment(Date.now()).format(format)
        console.log(debug(`${time} :: [${sys}/DEBUG]`) + ` ${message}`);
    }
}

module.exports = Logger;
