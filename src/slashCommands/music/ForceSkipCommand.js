const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class SkipCommand extends BaseCommand {
    constructor() {
        super('force-skip', {
            data: new SlashCommandBuilder()
                .setName('force-skip')
                .setDescription('Пропустить текущий трек')
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const voice = message.member.voice.channelId;

        if (!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот <#${player.textId}>`);
        if (!player.queue.current) return client.replyError(message, `Очередь пуста, пропускать нечего`);

        player.skip();
        clearInterval(player.data.get('interval'));
        player.data.delete('messageVoice');
        player.data.delete('message');
        player.data.delete('interval');
        return client.replySuccess(message, `Трек **${player.queue.current.title}** пропущен по запросу **${message.user}**`);
    }
}

module.exports = SkipCommand;
