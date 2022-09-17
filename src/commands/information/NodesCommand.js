const BaseCommand = require('../../structures/BaseCommand');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');

class NodesCommand extends BaseCommand {
    constructor() {
        super('nodes', {
            category: 'information',
            description: "Статистика музыкальных нод"
        });
    }

    async run(client, message) {
        const nodes = client.manager.shoukaku.nodes.values();

        //if (!nodes || !nodes.stats || !nodes.stats.cpu) return message.error('Невозможно получить информацию о музыкальных нодах')



        let embed = new MessageEmbed()
            .setTitle('Музыкальные ноды')
            .setThumbnail(client.user.avatarURL({size: 1024, format: "png"}))
        for(const node of nodes) {
            embed.addField(`${node.name === 'Serene' ? node.name + ' [Основная]' : node.name + ' [Резервная]'}`, `
Онлайн: **${node.state ? client.customEmojis.yes : client.customEmojis.no}**
Подключена: **${!node.connected === true && node.state ? client.customEmojis.yes : client.customEmojis.no}**
Плееров: **${!node?.stats?.players ? 0 : node.stats.players}**
Активных плееров: **${!node?.stats?.playingPlayers ? 0 : node.stats.playingPlayers}**
Загрузка сервера: **${!node?.stats?.cpu ? client.customEmojis.no : (Math.round(node?.stats?.cpu.systemLoad * 100) / 100).toFixed(2) + '%'}**
        `)
        }
        embed.setTimestamp(Date.now())
        embed.setColor(client.color)
        await message.reply({content: null, embeds: [embed]})
    }
}

module.exports = NodesCommand;
