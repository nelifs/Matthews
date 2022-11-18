 const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class PauseCommand extends BaseCommand {
    constructor() {
        super('shuffle', {
            data: new SlashCommandBuilder()
                .setName('shuffle')
                .setDescription('Перемешать очередь')
        });
    }

    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

        const voice = interaction.member.voice.channelId;

        if (!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);

        await client.replySuccess(interaction, `Очередь из **${player.queue.size}** треков была перемешана.`);
        player.queue.shuffle();
    }
}

module.exports = PauseCommand;
