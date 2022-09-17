const BaseCommand = require('../../structures/BaseCommand');
const { Permissions } = require('discord.js');

class PlayCommand extends BaseCommand {
    constructor() {
        super('play', {
            category: 'music',
            description: 'Включить определённый трек по запросу',
            aliases: ['p', 'з', 'здфн'],
            usage: '<название трека/ссылка>',
            examples: ['Rick Astley - Never Gonna Give You Up ` — Включит всем известный трек', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ` — Так же возможен поиск по ссылкам с ютуба'],
            botPermissions: ['CONNECT', 'SPEAK']
        });
    }

    async run(client, message, args) {
        const guild = client.database.findOne('guilds', { id: message.guild.id });

        const voice = message.member.voice;
        const query = args.join(' ');
        if(!voice.channelId) return client.replyError(message, `Для начала Вам нужно зайти в канал`);
        if (!query) return client.replyError(message, `Укажите название/ссылку на трек для его воспроизведения`);
        if(!message.guild.me.permissionsIn(message.guild.channels.cache.get(voice.channelId)).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return client.replyError(message, 'Упс... У меня недостаточно прав для захода в голосовой канал. Необходимые права: **Подключаться, Говорить**');

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: voice.channelId,
            selfDeaf: true,
        }).catch(err => client.replyError(message, 'Упс... Я не могу подключиться к каналу. Проверьте права моей роли'));


        if(voice.channelId !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот`);

        let result = await client.manager.search(query, { requester: message.author });
        if (!result.tracks.length) return client.replyError(message, 'По запросу **' + query + '** ничего не найдено');

        if (result.type === 'PLAYLIST') for (let track of result.tracks) player.queue.add(track);
        else player.queue.add(result.tracks[0]);

        //if (!guild.volume) client.database.setOne('guilds', { id: message.guild.id }, { volume: 100 });

        if (!player.playing && !player.paused) player.setVolume(parseInt(!guild.volume ? 100 : guild.volume)) && await player.play();
        return client.replySuccess(message, (result.type === 'PLAYLIST' ? `Добавлено **${result.tracks.length}** треков из плейлиста **${result.playlistName}**` : `Трек **${result.tracks[0].title}** добавлен в очередь`));
    }
}

module.exports = PlayCommand;
