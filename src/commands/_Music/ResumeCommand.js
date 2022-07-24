module.exports = {
    name: 'resume',
    aliases: ['rs', 'к', 'куыгьу'],
    public: true,
    description: 'Продолжить воспроизведение трека',

    async execute(client, message, args) {
        const player = message.client.manager.get(message.guild.id);

        if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);
    
        const voice = message.member.voice.channelId;
        
        if(!voice) return message.reply(`${client.customEmojis.no} Для начала тебе нужно зайти в голосовой канал`);
        if(voice !== player.voiceChannel) return message.reply(`${client.customEmojis.no} Ты не в том же канале, что и бот`);
  
        if(!player.paused) return message.reply(`${client.customEmojis.no} Плеер и воспроизводит музыку`)
  
        player.pause(false);
        return message.reply(`${client.customEmojis.yes} Воспроизведение запущено по запросу **${message.author}**`)
    }
}