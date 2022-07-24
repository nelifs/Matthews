const BaseCommand = require('../../structures/BaseCommand');

class PlayCommand extends BaseCommand {
    constructor() {
        super('play', {
            category: 'Music',
            description: 'Включить определённый трек по запросу',
            aliases: ['p']
        });
    }

    async run(client, message, args) {
        const voice = message.member.voice;
        const search = args.join(" ");
        if(!voice.channelId) return message.error(`Для прослушивания музыки нужно зайти в голосовой канал`);
        if(!search) return message.error(`Укажите название/ссылку на трек для его воспроизведения`);

        let res;
        try {
            res = await client.manager.search(search);
            if (res.loadType === "LOAD_FAILED") throw res.exception;
            //else if (res.loadType === "PLAYLIST_LOADED") throw { message: "Плейлисты не поддерживаются в этой команде" };
        } catch (err) {
            return message.error(`Во время поиска песни возникла ошибка: ${err.message}`);
        }

        if (res.loadType === "NO_MATCHES") return message.error(`Ни одного трека не было найдено.`);

        const messsage = await message.reply(`${client.customEmojis.neutral} Поиск трека...`)

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: voice.channelId,
            textChannel: message.channel.id,
            selfDeafen: true,
        });

        player.connect();
        player.queue.add(res.tracks[0]);

        if(!player.playing && !player.paused && !player.queue.size) player.play()
        return await messsage.edit(`${client.customEmojis.yes} Трек **${res.tracks[0].title}** успешно добавлен в очередь!`);
    }
}

module.exports = PlayCommand;