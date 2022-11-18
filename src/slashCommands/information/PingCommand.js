const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

class PingCommand extends BaseCommand {
    constructor(props) {
        super('ping', {
            data: new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Понг!')
        });
    }

    async run(client, interaction) {
        const embed = new MessageEmbed()
            .addFields({
                    name: 'Задержка API', value: `
\` > \` Сейчас: **${client.ws.ping}ms**
\` > \` 5 мин: **${client.ping5m}ms**
\` > \` 15 мин: **${client.ping15m}ms**`
                }
            )
            .setColor(client.colors.main)
            .setTimestamp(client.ws.shards.first().lastPingTimestamp);
        interaction.reply({ embeds: [embed] });
    }
}

module.exports = PingCommand;
