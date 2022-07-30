const BaseCommand = require('../../structures/BaseCommand');
const {readdirSync} = require('fs');

class ReloadCommand extends BaseCommand {
    constructor() {
        super('reload', {
            category: 'dev',
            description: 'релоад',
            aliases: ['r']
        });
    }

    async run(client, message, args) {
        let before = process.hrtime.bigint()
        const commandDirs = readdirSync('./src/commands')
        for (const dir of commandDirs) {
            const commandFiles = readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {

                delete require.cache[require.resolve(`../${dir}/${file}`)];
                const cmd = require(`../${dir}/${file}`)
                cmd.dir = dir
                cmd.filename = file
                client.commands.set(cmd.name, cmd);
            }

        }
        let after = process.hrtime.bigint()
        let time = (parseInt(after - before) / 1000000).toFixed(3)
        message.reply(`All commands were reloaded in \`${time}ms\``)
    }
}

module.exports = ReloadCommand;