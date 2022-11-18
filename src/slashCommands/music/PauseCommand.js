const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class PauseCommand extends BaseCommand {
    constructor() {
        super('pause', {
            data: new SlashCommandBuilder()
                .setName('pause')
                .setDescription('Поставить воспроизведение на паузу')
        });
    }

    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) return client.replyError(interaction, `${client.customEmojis.no} Ни одного плеера не запущено`);

        const voice = interaction.member.voice.channelId;

        if(!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if(player.paused) return client.replyError(interaction, `${client.customEmojis.no} Плеер и так стоит на паузе`)

        player.pause(true);
        return client.replySuccess(interaction, `Воспроизведение остановлено по запросу **${interaction.user}**`)
    }
}

module.exports = PauseCommand;
