const levels = {
    none: 0.0,
    low: 0.20,
    medium: 0.35,
    high: 0.45,
  };

module.exports = {
    name: 'bassboost',
    aliases: ['b', 'и', 'ифыыищщые'],
    public: true,
    description: 'Увеличение уровня басса',

    async execute(client, message, args) {
        const player = message.client.manager.get(message.guild.id);

        if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);
        if (!args.length) return message.reply(`${client.customEmojis.yes} Текущая кромкость **${player.volume}**`)
    
        const voice = message.member.voice.channelId;
        
        if(!voice) return message.reply(`${client.customEmojis.no} Для начала тебе нужно зайти в голосовой канал`);
        if(voice !== player.voiceChannel) return message.reply(`${client.customEmojis.no} Ты не в том же канале, что и бот`);
    
        let level = "нулевой";
        if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();
    
        const bands = new Array(3)
          .fill(null)
          .map((_, i) =>
            ({ band: i, gain: levels[level] })
          );
    
        player.setEQ(...bands);
        return message.reply(`${client.customEmojis.yes} Уровень бассбуста установлен на **${level}**`);
    }
}