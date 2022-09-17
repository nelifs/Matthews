const BaseListener = require('../structures/BaseListener');

class TrackStartListener extends BaseListener {
    constructor() {
        super('TrackStart', { event: 'trackStart', type: 1 });
    }

    async run(client, player, track) {
        const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji('⏸')
                    .setStyle("SECONDARY")
                    .setLabel("Пауза")
                    .setDisabled(false)
                    .setCustomId('pause'),
                new MessageButton()
                    .setEmoji('▶')
                    .setStyle("SECONDARY")
                    .setLabel("Продолжить")
                    .setDisabled(true)
                    .setCustomId('resume'),
                new MessageButton()
                    .setEmoji('⏭')
                    .setStyle("SECONDARY")
                    .setLabel("Пропустить")
                    .setCustomId('skip'),
                new MessageButton()
                    .setEmoji('🔁')
                    .setStyle("SECONDARY")
                    .setLabel("Повтор")
                    .setCustomId('repeat'),
            )

        const embed = new MessageEmbed()
            .setAuthor({name: track.title, url: track.uri})
            .setThumbnail(track.thumbnail)
            .setDescription(`
Автор: **${track.author}**
Повтор: **${player.trackRepeat ? 'Включен' : 'Выключен'}**
Состояние плеера: **${player.state}**

Громкость: ${player.volume}/${client.lavalink.maxVolume}
${client.functions.progressbar(player.volume, client.lavalink.maxVolume)}

Время: ${client.functions.duration(player.position)}/${client.functions.duration(track.duration)}
${`[▬](${track.uri})`.repeat(Math.floor(player.position / track.duration * 20)) + '▬'.repeat(20 - Math.floor(player.position / track.duration * 20))}
           `)
            .setFooter({text: `${player.node.options.name} #${player.node.options.id}`})
            .setTimestamp()
            .setColor(client.colors.main)
        let message = await client.channels.cache.get(player.textChannel).send({ embeds: [embed], components: [row] })

        const collector = client.channels.cache.get(player.textChannel).createMessageComponentCollector({ time: track.duration })

        collector.on('collect', async b => {
        await b.deferReply()
            if (b.customId === 'pause') return await b.reply('Воспроизведение остановлено') && player.paused ? b.setDisabled(true) : b.setDisabled(false) && player.pause(true);
            if (b.customId === 'resume') return await b.reply('Воспроизведение продолжено') && !player.paused ? b.setDisabled(true) : b.setDisabled(false) && player.pause(false);
            if (b.customId === 'skip') return await b.reply('Трек пропущен') && player.stop();
            if (b.customId === 'repeat') return await b.reply('Повтор трека включен/выключен') && player.trackRepeat ? player.setTrackRepeat(true) : player.setTrackRepeat(false);
        })

        let interval = setInterval(() => {
            embed.setDescription(`
Автор: **${track.author}**
Повтор: **${player.trackRepeat ? 'Включен' : 'Выключен'}**
Состояние плеера: **${player.state}**

Громкость: ${player.volume}/${client.lavalink.maxVolume}
${client.functions.progressbar(player.volume, client.lavalink.maxVolume)}

Время: ${client.functions.duration(player.position)}/${client.functions.duration(track.duration)}
${`[▬](${track.uri})`.repeat(Math.floor(player.position / track.duration * 20)) + '▬'.repeat(20 - Math.floor(player.position / track.duration * 20))}
           `)
            message.edit({embeds: [embed]})
        }, 2000)
        client.activePlayers.set(player.textChannel, {
            textChannel: player.textChannel,
            messageId: client.channels.cache.get(player.textChannel).id,
            interval: interval,
        });
    }
}

module.exports = TrackStartListener;
