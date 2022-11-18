const { MessageEmbed, version } = require('discord.js');
const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class StatsCommand extends BaseCommand {
    constructor() {
        super('settings', {
            data: new SlashCommandBuilder()
                .setName('settings')
                .setDescription('Просмотр текущих настроек бота')
        });
    }

    async run(client, message) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id });

        const embed = new MessageEmbed()
            .setTitle('Настройки')
            .setDescription(`
Режим 24/7: **${guild?.infinityPlaying ? `Включен` : 'Отключен'}**
Режим диджея: **${guild?.djStatus ? `Включен` : 'Отключен'}**
Роль диджеев: **${guild?.djRole ? `<@&${guild?.djRole}>` : 'Не установлено'}**

**Права диджеев:**
${guild?.djPerms.map(r => '` > ` ' + client.constants.djPerms[r]).join('\n') ?? 'Не установлено'}
            `)
            .setColor(client.colors.main);
        await message.reply({ embeds: [embed] });
    }
}

module.exports = StatsCommand;
