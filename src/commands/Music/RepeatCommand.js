const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'repeat',
    aliases: ['rt', 'loop', 'ке', 'дщщз', 'кузуфе'],
    public: true,
    description: 'Включить повторение трека/очереди',

    async execute(client, message, args) {
      const player = message.client.manager.get(message.guild.id);

      if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);
  
      const voice = message.member.voice.channelId;
      
      if(!voice) return message.reply(`${client.customEmojis.no} Для начала тебе нужно зайти в голосовой канал`);
      if(voice !== player.voiceChannel) return message.reply(`${client.customEmojis.no} Ты не в том же канале, что и бот`);
      
      if (args.length && /queue/i.test(args[0])) {
        player.setQueueRepeat(!player.queueRepeat);
        const queueRepeat = player.queueRepeat ? "включен" : "отключен";
        return message.reply(`${client.customEmojis.yes} Повтор очереди **${queueRepeat}**`);
      }
  
      player.setTrackRepeat(!player.trackRepeat);
      const trackRepeat = player.trackRepeat ? "включен" : "отключен";
      return message.reply(`${client.customEmojis.yes} Повтор трека **${trackRepeat}**`);
    }
}