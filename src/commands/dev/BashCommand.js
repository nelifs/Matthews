const BaseCommand = require('../../structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

class BashCommand extends BaseCommand {
    constructor() {
        super('bash', {
            category: 'dev',
            description: 'баш баш ебаш'
        });
    }

    async run(client, message, args) {
        let processing = new MessageEmbed()
            .setTitle('Processing...')
            .setColor(client.colors.main)
            .setTimestamp(Date.now())
        let ms = await message.reply({embeds: [processing]});
        let child = require('child_process')
        let before = process.hrtime.bigint()
        child.exec(args.join(' '), async (err, res) => {
            let after = process.hrtime.bigint();
            let time = (parseInt(after - before) / 1000000).toFixed(3);
            let error = new MessageEmbed()
                .setTitle('Error')
                .setDescription(`Executed in \`${time}ms\``)
                .addField("Result", `\`\`\`bash\n${err}\`\`\``)
                .setColor(client.colors.error)
                .setTimestamp(Date.now())
            if(err) return ms.edit({embeds: [error]});
            let success = new MessageEmbed()
                .setTitle('Success!')
                .setDescription(`Executed in \`${time}ms\``)
                .addField("Result", `\`\`\`bash\n${res}\`\`\``)
                .setColor(client.colors.success)
                .setTimestamp(Date.now())
            await message.reply({embeds: [success]});
            await ms.delete()
        });
    }
}

module.exports = BashCommand;