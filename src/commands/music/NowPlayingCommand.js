const BaseCommand = require('../../structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

class NowPlayingCommand extends BaseCommand {
    constructor() {
        super('now-playing', {
            category: 'music',
            aliases: ['np', 'nowplaying', 'тз', 'тщцздфнштп', 'тщц-здфнштп'],
            description: 'Просмотр информации о текущем треке',
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const track = player.queue.current;

        let loop;
        if(player.loop === 'queue') loop = 'Очередь'
        else if(player.loop === 'track') loop = 'Текущий трек'
        else loop = 'Отключен'


        const embed = new MessageEmbed()
            .setAuthor({name: track.title, url: track.uri})
            .setThumbnail(track.thumbnail)
            .setDescription(`
Автор: **${track.author}**
Повтор: **${loop}**
Состояние плеера: **${!player.paused ? "Проигрывается трек" : "На паузе"}**
Громкость: **${~~(player.volume * 100).toFixed(0)}/${client.lavalink.maxVolume}**

Время: **${client.functions.duration(player.shoukaku.position)}/${client.functions.duration(track.length)}**
${client.functions.progressBar(track, player, 17)}
      `)
            .setFooter({ text: `Трек заказан: ${track.requester.username}` })
            .setTimestamp()
            .setColor(client.color)
        await message.reply({embeds: [embed]})
    }
}

module.exports = NowPlayingCommand;
