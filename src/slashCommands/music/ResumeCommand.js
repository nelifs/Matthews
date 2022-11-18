const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class ResumeCommand extends BaseCommand {
    constructor() {
        super('resume', {
            data: new SlashCommandBuilder()
                .setName('resume')
                .setDescription('Продолжить воспроизведение')
        });
    }

    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

        const voice = interaction.member.voice.channelId;

        if(!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if(!player.paused) return client.replyError(interaction, `${client.customEmojis.no} Плеер не стоит на паузе`)

        player.pause(false);
        return client.replySuccess(interaction, `Воспроизведение запущено по запросу **${interaction.user}**`)
    }
}

module.exports = ResumeCommand;


