const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'now-playing',
    aliases: ['np', 'nowplaying', 'тз', 'тщцздфнштп'],
    public: true,
    description: 'Просмотр информации о текущем треке',

    async execute(client, message, args) {
      const player = message.client.manager.get(message.guild.id);
      if(!player) return message.reply(`${client.customEmojis.no} На этом сервере не запущен ни один плеер`);

      const song = player.queue.current; 


      const embed = new MessageEmbed()
      .setAuthor({name: song.title, url: song.uri})
      .setThumbnail(song.thumbnail)
      .setDescription(`
Автор: **${song.author}**
Повтор: **${player.trackRepeat ? 'Включен' : 'Выключен'}**
Состояние плеера: **${player.state ? 'Подключён' : 'Отключён'}**

Громкость: ${player.volume}/${client.lavalink.maxVolume}
${client.utils.progressbar(player.volume, client.lavalink.maxVolume)}

Время: ${client.utils.duration(player.position)}/${client.utils.duration(song.duration)}
${`[▬](${song.uri})`.repeat(Math.floor(player.position / song.duration * 20)) + '▬'.repeat(20 - Math.floor(player.position / song.duration * 20))}
      `)
      .setFooter({text: `${player.node.options.name} #${player.node.options.id}`})
      .setTimestamp()
      .setColor(client.colors.main)
      message.reply({embeds: [embed]})
    }
}