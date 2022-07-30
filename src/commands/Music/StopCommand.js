module.exports = {
    name: 'stop',
    aliases: ['st', 'ыещз', 'ые'],
    public: true,
    description: 'Остановить воспроизведение с выходом бота',

    async execute(client, message, args) {
        const player = message.client.manager.get(message.guild.id);

        if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);
    
        const voice = message.member.voice.channelId;
        
        if(!voice) return message.reply(`${client.customEmojis.no} Для начала тебе нужно зайти в голосовой канал`);
        if(voice !== player.voiceChannel) return message.reply(`${client.customEmojis.no} Ты не в том же канале, что и бот`);

        const activePlayer = client.activePlayers;
        clearInterval(activePlayer.get(player.textChannel)?.interval);
        activePlayer.delete(player.textChannel);
        player.destroy();
        return message.reply(`${client.customEmojis.yes} Воспроизведение остановлено, плеер уничтожен`);
    }
}