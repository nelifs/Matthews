module.exports = {
    name: 'volume',
    aliases: ['v', 'м', 'мщдуьг'],
    public: true,
    description: 'Прибавить/Убавить громкость',

    async execute(client, message, args) {
        const player = message.client.manager.get(message.guild.id);

        if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);
        if (!args.length) return message.reply(`${client.customEmojis.yes} Текущая кромкость **${player.volume}**`)
    
        const voice = message.member.voice.channelId;
        
        if(!voice) return message.reply(`${client.customEmojis.no} Для начала тебе нужно зайти в канал`);
        if(voice !== player.voiceChannel) return message.reply(`${client.customEmojis.no} Ты не в том же канале, что и бот`);
    
        const volume = Number(args[0]);
        
        if (!volume || volume < client.lavalink.minVolume || volume > client.lavalink.maxVolume) return message.reply(`${client.customEmojis.no} Тебе нужно указать громкость, от ${client.lavalink.minVolume} до ${client.lavalink.maxVolume}`);
    
        player.setVolume(volume);
        await message.reply(`${client.customEmojis.yes} Громкость плеера установлена на **${volume}**`);
    }
}