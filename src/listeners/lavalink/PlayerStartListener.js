const BaseListener = require('../../structures/BaseListener');
const { MessageButton } = require('discord.js');

class PlayerStartListener extends BaseListener {
    constructor() {
        super('PlayerStart', { event: 'playerStart', type: 2 });
    }

    async run(client, player, track) {
        const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

        const row = new MessageActionRow()
            .addComponents(/*
                new MessageButton()
                    .setEmoji(client.customEmojis.music.skip)
                    .setStyle('SECONDARY')
                    .setCustomId('previous'),*/
                new MessageButton()
                    .setEmoji(client.customEmojis.music.pause)
                    .setStyle('SECONDARY')
                    .setCustomId('pauseResume'),
                new MessageButton()
                    .setEmoji(client.customEmojis.music.stop)
                    .setStyle('SECONDARY')
                    .setCustomId('stop'),
                new MessageButton()
                    .setEmoji(client.customEmojis.music.skip)
                    .setStyle('SECONDARY')
                    .setCustomId('skip'),
            );
        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji(client.customEmojis.music.repeatOff)
                    .setStyle('SECONDARY')
                    .setCustomId('repeat'),
                new MessageButton()
                    .setEmoji(client.customEmojis.music.volumeDown)
                    .setStyle('SECONDARY')
                    .setCustomId('volumeDown'),
                new MessageButton()
                    .setEmoji(client.customEmojis.music.volumeUp)
                    .setStyle('SECONDARY')
                    .setCustomId('volumeUp'),
            );

        let loop;
        if (player.loop === 'queue') loop = 'Очередь';
        else if (player.loop === 'track') loop = 'Текущий трек';
        else loop = 'Отключен';

        const embed = new MessageEmbed()
            .setAuthor({ name: track.title, url: track.uri })
            .setThumbnail(track.thumbnail)
            .setDescription(`
Автор: **${track.author}**
Повтор: **${loop}**
Громкость: **${~~(player.volume * 100).toFixed(0)}/${client.lavalink.maxVolume}**

**${client.functions.convertTime(player.shoukaku.position)}/${client.functions.convertTime(track.length)}**
${client.functions.progressBar(track, player, 17)}
      `)
            .setFooter({ text: `Трек заказан: ${track.requester?.username}` })
            .setTimestamp()
            .setColor(client.colors.main);


        clearInterval(player.data.get('interval'));
        player.data.delete('message');
        player.data.delete('messageVoice');
        player.data.delete('interval');

        const messsage = await client.channels.cache.get(player.textId)?.send({
            embeds: [embed],
            components: [row, row1]
        });
        const messsage1 = await client.channels.cache.get(player.voiceId)?.send({
            embeds: [embed],
            components: [row, row1]
        });
        player.data.set('message', messsage);
        player.data.set('messageVoice', messsage1);

        const interval = setInterval(() => {
            if (player.loop === 'queue') loop = 'Очередь';
            else if (player.loop === 'track') loop = 'Текущий трек';
            else loop = 'Отключен';

            messsage1.edit({
                embeds: [embed.setDescription(`
Автор: **${track.author}**
Повтор: **${loop}**
Громкость: **${~~(player.volume * 100).toFixed(0)}/${client.lavalink.maxVolume}**

**${client.functions.convertTime(player.shoukaku.position)}/${client.functions.convertTime(track.length)}**
${client.functions.progressBar(track, player, 17)}
        `)]
            }).catch(console.error);

            messsage.edit({
                embeds: [embed.setDescription(`
Автор: **${track.author}**
Повтор: **${loop}**
Громкость: **${~~(player.volume * 100).toFixed(0)}/${client.lavalink.maxVolume}**

**${client.functions.convertTime(player.shoukaku.position)}/${client.functions.convertTime(track.length)}**
${client.functions.progressBar(track, player, 17)}
        `)]
            }).catch(console.error);
        }, 10000);
        player.data.set('interval', interval);
        player.data.set('votesToSkip', 0);
        player.data.set('membersVotedToSkip', []);
/*        player.data.set('votesToPrevious', 0);
        player.data.set('membersVotedToPrevious', []);*/
        client.logger.send('MusicManager', 'Player started in guild ' + player.guildId);
    }
}

module.exports = PlayerStartListener;
