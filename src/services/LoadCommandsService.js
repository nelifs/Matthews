const path = require('path');
const fs = require('fs').promises;
const BaseCommand = require('../structures/BaseCommand');

module.exports = async function LoadCommands(client, dir = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    let category;
    for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) {
            category = file;
            if (!file.startsWith('_')) {
                if (file === 'dev') {
                    await LoadCommands(client, path.join(dir, file));
                } else {
                    client.categories.push(file);
                    await LoadCommands(client, path.join(dir, file));
                }
            }
        }
        if (file.endsWith('.js')) {
            const Command = require(path.join(filePath, file));
            //client.logger.send(`Commands Loader`, `Command ${file} successfully loaded`)
            if (Command.prototype instanceof BaseCommand) {
                const cmd = new Command();
                client.commands.set(cmd.name, cmd);
            }
        }
    }
};
