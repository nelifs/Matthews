const path = require('path');
const fs = require('fs');
const BaseSlashCommand = require('../structures/BaseSlashCommand');

module.exports = async function LoadCommands(client, dir = '') {
    for (let folder of fs.readdirSync('./src/slashCommands')) {
        for (let file of fs.readdirSync(`./src/slashCommands/${folder}`).filter(x => x.endsWith('.js'))) {
            const Command = require(`../slashCommands/${folder}/${file}`);
            const cmd = new Command();
            client.commandsArray.push(cmd.data.toJSON());
            client.slashCommands.set(cmd.data.toJSON().name, cmd);
        }
    }
};
