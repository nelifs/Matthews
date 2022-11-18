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

    async run(client, message, args) {
        const player = client.manager.players.get(message.guild.id);

        const volume = message.options.getInteger('громкость');

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const voice = message.member.voice.channelId;

        if(!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if (!volume || volume < client.lavalink.minVolume || volume > client.lavalink.maxVolume) return client.replyError(message, `Вам нужно указать громкость, от ${client.lavalink.minVolume} до ${client.lavalink.maxVolume}`);

        player.setVolume(volume);
        await client.replySuccess(message, `Громкость плеера установлена на **${volume}**`);
    }
}

module.exports = VolumeCommand;

