const BaseCommand = require('../../structures/BaseCommand');

class SkipCommand extends BaseCommand {
    constructor() {
        super('skip', {
            category: 'music',
            aliases: ['s', 'ы', 'ылшз'],
            description: 'Пропустить текущий трек',
        });
    }

    async run(client, message, args) {
        const player = client.manager.players.get(message.guild.id);
        const trackPos = args[0];

        if (!player) return client.replyError(message, `${client.customEmojis.no} Ни одного плеера не запущено`);

        const voice = message.member.voice.channelId;

        if(!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);
        if(!player.queue.current) return client.replyError(message, `${client.customEmojis.no} Очередь пуста, пропускать нечего`)


        player.skip();
        clearInterval(player.data.get("interval"));
        player.data.delete("messageVoice");
        player.data.delete("message");
        player.data.delete("interval");
        return client.replySuccess(message, `Трек **${player.queue.current.title}** пропущен по запросу **${message.author}**`)
    }
}

module.exports = SkipCommand;
