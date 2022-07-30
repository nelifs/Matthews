module.exports = {
    name: 'pause',
    aliases: ['pe', 'з', 'зфгыу'],
    public: true,
    description: 'Поставить воспроизведение на паузу',

    async execute(client, message, args) {
        const player = message.client.manager.get(message.guild.id);

        if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);
    
        const voice = message.member.voice.channelId;
        
        if(!voice) return message.reply(`${client.customEmojis.no} Для начала тебе нужно зайти в голосовой канал`);
        if(voice !== player.voiceChannel) return message.reply(`${client.customEmojis.no} Ты не в том же канале, что и бот`);
  
        if(player.paused) return message.reply(`${client.customEmojis.no} Плеер и так стоит на паузе`)
  
        player.pause(true);
        return message.reply(`${client.customEmojis.yes} Воспроизведение остановлено по запросу **${message.author}**`)
    }
}