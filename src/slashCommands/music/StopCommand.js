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

    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

        const voice = interaction.member.voice.channelId;

        if (!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);

        clearInterval(player.data.get('interval'));
        player.data.get('messageVoice').delete();
        player.data.get('interaction').delete();
        player.destroy();
        return client.replySuccess(interaction, `Воспроизведение остановлено, плеер уничтожен`);
    }
}

module.exports = PauseCommand;
