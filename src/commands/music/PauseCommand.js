const BaseCommand = require('../../structures/BaseCommand');

class PauseCommand extends BaseCommand {
    constructor() {
        super('pause', {
            category: 'music',
            aliases: ['зфгыу'],
            description: 'Поставить воспроизведение на паузу',
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return client.replyError(message, `${client.customEmojis.no} Ни одного плеера не запущено`);

        const voice = message.member.voice.channelId;

        if(!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);

        if(player.paused) return client.replyError(message, `${client.customEmojis.no} Плеер и так стоит на паузе`)

        player.pause(true);
        return client.replySuccess(message, `Воспроизведение остановлено по запросу **${message.author}**`)
    }
}

module.exports = PauseCommand;
