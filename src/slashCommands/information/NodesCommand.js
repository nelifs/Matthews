const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class NodesCommand extends BaseCommand {
    constructor() {
        super('nodes', {
            data: new SlashCommandBuilder()
                .setName('nodes')
                .setDescription('Статистика музыкальных нод')
        });
    }

    async run(client, interaction) {
        const nodes = client.manager.shoukaku.nodes.values();

        //if (!nodes || !nodes.stats || !nodes.stats.cpu) return interaction.error('Невозможно получить информацию о музыкальных нодах')


        let embed = new MessageEmbed()
            .setTitle('Музыкальные ноды')
            .setThumbnail(client.user.avatarURL({ size: 1024, format: 'png' }));
        for (const node of nodes) {
            embed.addField(`${node.group === 'main' ? node.name + ' [Основная]' : node.name + ' [Резервная]'}`, `
Онлайн: **${node.state ? client.customEmojis.yes : client.customEmojis.no}**
Подключена: **${!node.connected === true && node.state ? client.customEmojis.yes : client.customEmojis.no}**
Плееров: **${node.stats.players ?? 'err'}**
Активных плееров: **${node.stats.playingPlayers ?? 'err'}**

**Нагрузка:**
\` > \` Лавалинк: **${(node?.stats?.cpu.lavalinkLoad * 100).toFixed(2) + '%' ?? 'err'}** 
\` > \` Система: **${(node?.stats?.cpu.systemLoad * 100).toFixed(2) + '%' ?? 'err'}** 

**Память:** 
\` > \` Используется: **${client.functions.numberFormat(~~(node?.stats?.memory.used / 1024 ** 2), 0, '.', ',')} MB**
\` > \` Выделено: **${client.functions.numberFormat(~~(node?.stats?.memory.allocated / 1024 ** 2), 0, '.', ',')} MB**
        `, true);
        }
        embed.setColor(client.colors.main);
        await interaction.reply({ content: null, embeds: [embed] });
    }
}

module.exports = NodesCommand;
