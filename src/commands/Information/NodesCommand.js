const BaseCommand = require('../../structures/BaseCommand');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');

class NodesCommand extends BaseCommand {
    constructor() {
        super('nodes', {
            category: 'Information',
            description: "Статистика музыкальных нод"
        });
    }

    async run(client, message, args) {
        let players = 0;
        let guilds = client.guilds.cache.map((guild) => guild);
        for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].me.voice) {
                players = +1;
            }
        }

        const nodeMemoryAllocated = client.manager.nodes.map(n => (n.stats.memory.allocated / 1024 ** 2).toFixed(0));
        const nodeMemoryUsed = client.manager.nodes.map(n => (n.stats.memory.used / 1024 ** 2).toFixed(0));
        const nodePlayingPlayers = client.manager.nodes.map(n => n.stats.playingPlayers);
        const nodeUptime = client.manager.nodes.map(n => n.stats.uptime);
        const nodeLoad = Array.from(client.manager.nodes.map(n => (n.stats.cpu.lavalinkLoad * 100).toFixed(0)))
        const nodeShards = client.manager.nodes.map(n => n.manager.options.shards).join(', ');

        function getLoad(x) {
            let s = 0;
            for (let i = 0; i < x.length; i++) {
                s += x[i]
            }
            return s / 1;
        }


        let embed = new MessageEmbed()
            .setTitle('Музыкальные ноды')
            .setThumbnail(client.user.avatarURL({size: 1024, format: "png"}))
            .addField('Общая статистика', `
Плееров: **${players}**
Общая загрузка нод: **${getLoad(nodeLoad)}%**
`)
        let status;
        client.manager.nodes.map(node => {
            function statusPars() {
                const yes = client.customEmojis.yes;
                const no = client.customEmojis.no;
                status = ((node.stats.uptime / 1000) == 0 ? no : yes) + `${(node.stats.uptime / 1000) == 0 ? 'Оффлайн' : 'Онлайн'} :: ` + (node.connected == false ? no : yes) + ` ${node.connected == false ? 'Отключена' : 'Подключена'}`
            }
            statusPars()

            embed.addField(`${node.options.name} #${node.options.id}`, `
Статус: **${status}**
Плееров: **${node.stats.players}**
Активных плееров: **${node.stats.playingPlayers}**
Ядра процессора: **${node.stats.cpu.cores}**
Загрузка сервера: **${(node.stats.cpu.systemLoad * 100).toFixed(2)}%**
Загрузка Lavalink: **${(node.stats.cpu.lavalinkLoad * 100).toFixed(2)}%**
Память: **${(node.stats.memory.used / 1024 ** 2).toFixed(0)}/${(node.stats.memory.allocated / 1024 ** 2).toFixed(0)} MB**
Время работы: **${ms(node.stats.uptime)}**
Подключена **<t:${(node.options.connectedAt / 1000).toFixed(0)}:R>**\n
`)
        }).join('')
        embed.setTimestamp(Date.now())
        embed.setColor(client.colors.main)
        await message.reply({content: null, embeds: [embed]})
    }
}

module.exports = NodesCommand;
