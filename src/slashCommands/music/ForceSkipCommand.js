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

    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

        const voice = interaction.member.voice.channelId;

        if (!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);
        if (!player.queue.current) return client.replyError(interaction, `Очередь пуста, пропускать нечего`);

        player.skip();
        clearInterval(player.data.get('interval'));
        player.data.delete('interactionVoice');
        player.data.delete('interaction');
        player.data.delete('interval');
        return client.replySuccess(interaction, `Трек **${player.queue.current.title}** пропущен по запросу **${interaction.user}**`);
    }
}

module.exports = SkipCommand;
