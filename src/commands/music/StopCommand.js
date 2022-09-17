const BaseCommand = require('../../structures/BaseCommand');

class PauseCommand extends BaseCommand {
    constructor() {
        super('stop', {
            category: 'music',
            aliases: ['ыещз'],
            description: 'Уничтожить плеер и остановить воспроизведение',
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return message.reply(`${client.customEmojis.no} Ни одного плеера не запущено`);

        const voice = message.member.voice.channelId;

        if (!voice) return client.replyError(message, `ВДля начала Вам нужно зайти в канал`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);

        await client.deletePlayerTempInformation(player);
        client.manager.players.delete(message.guild.id);
        player.destroy();
        return client.replySuccess(message, `Воспроизведение остановлено, плеер уничтожен`);
    }
}

module.exports = PauseCommand;
