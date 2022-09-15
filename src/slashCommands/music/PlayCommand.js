const BaseSlashCommand = require('../../structures/BaseSlashCommand.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

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
                .addNumberOption(option =>
                    option.setName('громкость')
                        .setDescription('Громкость плеера')
                        .setRequired(false)),
            category: 'music',
        });
    }

    async run(client, message) {
        const voice = message.member.voice;
        const query = message.options.getString('запрос');
        const volume = message.options.getInteger('громкость') ?? 100;
        if (!voice.channelId) return client.replyError(message, `Для начала Вам нужно зайти в канал`);
        if (!query) return client.replyError(message, `Укажите название/ссылку на трек для его воспроизведения`);
        if (!message.guild.me.permissionsIn(message.guild.channels.cache.get(voice.channelId)).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return client.replyError(message, 'Упс... У меня недостаточно прав для захода в голосовой канал. Необходимые права: **Подключаться, Говорить**');

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: voice.channelId,
            selfDeaf: true,
        }).catch(err => client.replyError(message, 'Упс... Я не могу подключиться к каналу. Проверьте права моей роли или попробуйте позже...'));


        player.setVolume(volume);
        if (voice.channelId !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);

        let result = await client.manager.search(query, { requester: message.user });
        if (!result.tracks.length) return client.replyError(message, 'По запросу **' + query + '** ничего не найдено');

        if (result.type === 'PLAYLIST') for (let track of result.tracks) player.queue.add(track);
        else player.queue.add(result.tracks[0]);

        if (!player.playing && !player.paused) player.setVolume(volume) && await player.play();
        return client.replySuccess(message, (result.type === 'PLAYLIST' ? `Добавлено **${result.tracks.length}** треков из плейлиста **${result.playlistName}**` : `Трек **${result.tracks[0].title}** добавлен в очередь`));
    }
}

module.exports = PlayCommand;
