const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class VolumeCommand extends BaseCommand {
    constructor() {
        super('volume', {
            data: new SlashCommandBuilder()
                .setName('volume')
                .setDescription('Громкость проигрывания')
                .addIntegerOption(option =>
                    option.setName('громкость')
                        .setDescription('Громкость плеера')
                        .setMaxValue(200)
                        .setMinValue(0)
                        .setRequired(true))
        });
    }

    async run(client, interaction, args) {
        const player = client.manager.players.get(interaction.guild.id);

        const volume = interaction.options.getInteger('громкость');

        if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

        const voice = interaction.member.voice.channelId;

        if(!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if (!volume || volume < client.lavalink.minVolume || volume > client.lavalink.maxVolume) return client.replyError(interaction, `Вам нужно указать громкость, от ${client.lavalink.minVolume} до ${client.lavalink.maxVolume}`);

        player.setVolume(volume);
        await client.replySuccess(interaction, `Громкость плеера установлена на **${volume}**`);
    }
}

module.exports = VolumeCommand;

