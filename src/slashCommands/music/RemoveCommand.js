const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class PauseCommand extends BaseCommand {
    constructor() {
        super('remove', {
            data: new SlashCommandBuilder()
                .setName('remove')
                .setDescription('Удалить определённый трек для удаления из очереди')
                .addIntegerOption(option =>
                    option.setName('позиция')
                        .setDescription('Позиция трека для удаления')
                        .setRequired(true))
        });
    }

    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id);
        const position = interaction.options.getInteger('позиция');

        if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

        const voice = interaction.member.voice.channelId;

        if (!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if (position > player.queue.size) return client.replyError(interaction, 'Неизвестный трек. Проверьте правильность позиции **/queue**');

        await client.replySuccess(interaction, `Трек **[${player.queue[position - 1].title}](${player.queue[position - 1].uri})** удалён.`);
        player.queue.splice(position - 1);
    }
}

module.exports = PauseCommand;
