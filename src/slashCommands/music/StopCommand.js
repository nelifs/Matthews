const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class PauseCommand extends BaseCommand {
    constructor() {
        super('stop', {
            data: new SlashCommandBuilder()
                .setName('stop')
                .setDescription('Остановить воспроизведение')
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const voice = message.member.voice.channelId;

        if (!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот <#${player.textId}>`);

        clearInterval(player.data.get('interval'));
        player.data.get('messageVoice').delete();
        player.data.get('message').delete();
        player.destroy();
        return client.replySuccess(message, `Воспроизведение остановлено, плеер уничтожен`);
    }
}

module.exports = PauseCommand;
