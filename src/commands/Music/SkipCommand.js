module.exports = {
    name: 'skip',
    aliases: ['s', 'ы', 'ылшз'],
    public: true,
    description: 'Пропустить текущий/желаемый трек',

    async execute(client, message, args) {
        const player = message.client.manager.get(message.guild.id);

        if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);
    
        const voice = message.member.voice.channelId;
        
        if(!voice) return message.reply(`${client.customEmojis.no} Для начала тебе нужно зайти в голосовой канал`);
        if(voice !== player.voiceChannel) return message.reply(`${client.customEmojis.no} Ты не в том же канале, что и бот`);
  
        if(!player.queue.current) return message.reply(`${client.customEmojis.no} Очередь пуста, пропускать нечего`)
  
        const { title } = player.queue.current;

        /*const activePlayer = client.activePlayers.get(player.textChannel);
        clearInterval(activePlayer.interval);
        activePlayer.delete(player.textChannel);*/
        player.stop();
        return message.reply(`${client.customEmojis.yes} Трек **${title}** пропущен по запросу **${message.author}**`)
    }
}