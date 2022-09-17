const BaseCommand = require('../../structures/BaseCommand');

class ResumeCommand extends BaseCommand {
    constructor() {
        super('resume', {
            category: 'music',
            aliases: ['rs', 'к', 'куыгьу'],
            description: 'Продолжить воспроизведение трека',
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return client.replyError(message, `${client.customEmojis.no} Ни одного плеера не запущено`);

        const voice = message.member.voice.channelId;

        if(!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);

        if(!player.paused) return client.replyError(message, `${client.customEmojis.no} Плеер не стоит на паузе`)

        player.pause(false);
        return client.replySuccess(message, `Воспроизведение запущено по запросу **${message.author}**`)
    }
}

module.exports = ResumeCommand;


