const BaseSlashCommand = require('../../structures/BaseSlashCommand.js');
const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');

class PlayCommand extends BaseSlashCommand {
    constructor() {
        super('play', {
            data: new SlashCommandBuilder()
                .setName('play')
                .setDescription('Включить определённый трек по запросу')
                .addStringOption(option =>
                    option.setName('запрос')
                        .setDescription('Название/ссылка на трек')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('громкость')
                        .setDescription('Громкость плеера')
                        .setRequired(false)),
        });
    }

    async run(client, interaction) {
        const before = process.hrtime.bigint();
        await interaction.deferReply();
        const voice = interaction.member.voice;
        const query = interaction.options.getString('запрос');
        const volume = interaction.options.getInteger('громкость') ?? 100;
        if (!voice.channelId) return await client.replyError(interaction, `Для начала Вам нужно зайти в голосовой канал.`, true);
        if (!interaction.guild.me.permissionsIn(interaction.guild.channels.cache.get(voice.channelId)).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return await client.replyError(interaction, 'Упс... У меня недостаточно прав для захода в голосовой канал. Необходимые права: **Подключаться, Говорить**', true);


        const player = await client.manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: voice.channelId,
            selfDeaf: true,
        }).catch(async (err) => await client.replyError(interaction, 'Невозможно начать воспроизведение. Проверьте правильность ввода или права моих ролей.\nЕсли ошибка не пропала - обратитесь на сервер поддержки', true));

        player.setVolume(volume);
        if (voice.channelId !== player.shoukaku.connection.channelId) return await client.replyError(interaction, `Вы не в том же канале, что и бот.`, true);

        let result = await client.manager.search(query, { requester: interaction.user });
        if (!result.tracks.length) return interaction.replyError(interaction, 'По запросу **' + query + '** ничего не найдено.', true).catch(console.error);

        if (result.type === 'PLAYLIST') for (let track of result.tracks) player.queue.add(track);
        else player.queue.add(result.tracks[0]);

        if (!player.playing && !player.paused) player.setVolume(volume) && await player.play();
        const after = process.hrtime.bigint();
        const time = (parseInt(after - before) / 1000000 / 1000).toFixed(1);
        return await client.replySuccess(interaction, (result.type === 'PLAYLIST' ? `Добавлено **${result.tracks.length}** треков из плейлиста **${result.playlistName}** за **${time} сек.**` : `Трек **[${result.tracks[0].title}](${result.tracks[0].uri})** добавлен в очередь!`).toString(), true);
    }
}

module.exports = PlayCommand;
