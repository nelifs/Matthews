const BaseCommand = require('../../structures/BaseCommand');

class VolumeCommand extends BaseCommand {
    constructor() {
        super('volume', {
            category: 'music',
            aliases: ['v', 'м', 'мщдуьг', 'vol', 'мщд'],
            description: 'Прибавить/Убавить громкость',
            usage: '<уровень громкости>',
            examples: '200` — Установит максимальную громкость'
        });
    }

    async run(client, message, args) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return client.replyError(message, `Ни одного плеера не запущено`);
        if(player.volume === args[0]) return client.replyError(message, `Данная громкость уже установлена`);
        if (!args.length) return client.reply(message, 'Громкость', `Текущая кромкость **${~~(player.volume * 100).toFixed(0)}**`)

        const voice = message.member.voice.channelId;

        if(!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);

        const volume = Number(args[0]);

        if (!volume || volume < client.lavalink.minVolume || volume > client.lavalink.maxVolume) return client.replyError(message, `Вам нужно указать громкость, от ${client.lavalink.minVolume} до ${client.lavalink.maxVolume}`);

        player.setVolume(volume);
        await client.replySuccess(message, `Громкость плеера установлена на **${volume}**`);
    }
}

module.exports = VolumeCommand;

