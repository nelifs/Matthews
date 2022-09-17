const BaseCommand = require('../../structures/BaseCommand');

class RepeatCommand extends BaseCommand {
    constructor() {
        super('repeat', {
            category: 'music',
            aliases: ['rt', 'ке', 'кузуфе', 'loop', 'дщщз'],
            description: 'Включить/Выключить повторение трека/очереди',
            usage: '<off/track/queue>',
            examples: ['off` — Отключит повтор', 'track` — Включит повтор текущего трека', 'queue` — Включит повтор всей очереди']
        });
    }

    async run(client, message, args) {
        const player = client.manager.players.get(message.guild.id);
        const choice = args[0]

        if (!player) return client.replyError(message, `${client.customEmojis.no} Ни одного плеера не запущено`);

        const voice = message.member.voice.channelId;

        if (!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);

        if (choice === 'queue') {
            player.setLoop('queue');
            return client.replySuccess(message, `Повтор очереди **включен**`);
        } else if (choice === 'track') {
            player.setLoop('track');
            return client.replySuccess(message, `Повтор трека **включен**`);
        } else if (choice === 'off') {
            player.setLoop('none');
            return client.replySuccess(message, `Повтор **выключен**`);
        } else return client.reply(message, 'Повтор', `Для включения повтора введите:\n**queue** - повтор всей очереди; \n**track** - повтор одного трека; \n**off** - для отключения`)
    }
}

module.exports = RepeatCommand;
