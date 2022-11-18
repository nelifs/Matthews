const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class SkipCommand extends BaseCommand {
    constructor() {
        super('skip-to', {
            data: new SlashCommandBuilder()
                .setName('skip-to')
                .setDescription('Пропустить все треки до указанного')
                .addIntegerOption(option =>
                    option.setName('позиция')
                        .setDescription('Позиция трека до которого нужно пропустить')
                        .setRequired(true))
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);
        const guild = await client.database.findOne('guilds', { id: message.guild.id });
        const position = message.options.getInteger('позиция');

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const voice = message.member.voice.channelId;
        const needToSkip = (message.guild.channels.cache.get(voice).members.size / 2).toFixed(0);
        const voted = player.data.get('votesToSkip');
        const membersVoted = player.data.get('membersVotedToSkip');

        if (!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот <#${player.textId}>`);
        if (!player.queue.current) return client.replyError(message, `Очередь пуста, пропускать нечего`);

        if (position > player.queue.size) return client.replyError(message, 'Неизвестный трек. Проверьте правильность позиции **/queue**')

        if (guild.djStatus === true && message.member.roles.cache.has(guild.djRole) && guild.djPerms.includes('forceskip')) {
            if (position === 1) player.player.stopTrack();
            player.queue.splice(0, position - 1);
            player.skip()
            clearInterval(player.data.get('interval'));
            player.data.get('messageVoice').delete();
            player.data.get('message').delete();
            player.data.delete('messageVoice');
            player.data.delete('message');
            player.data.delete('interval');
            return client.replySuccess(message, `Трек **${player.queue.current.title}** пропущен по запросу диджея <@` + message.user + '>');
        }

        player.data.set('votesToSkip', voted + 1);
        player.data.set('membersVotedToSkip', membersVoted + message.user.id);

        if (membersVoted.includes(message.user.id)) return client.replyError(message, 'Вы уже проголосовали за пропуск.', false, true);

        if (voted >= needToSkip - 1) {
            if (position === 1) player.player.stopTrack();
            player.queue.splice(0, position - 1);
            player.skip()
            clearInterval(player.data.get('interval'));
            player.data.get('messageVoice').delete();
            player.data.get('message').delete();
            player.data.delete('messageVoice');
            player.data.delete('message');
            player.data.delete('interval');
            return client.replySuccess(message, `Трек **${player.queue.current.title}** пропущен по результатам голсования. \nПоследний проголосовавший: **${message.user}**`);
        } else client.reply(message, 'Голосование за пропуск', `Проголосовало **${voted + 1}/${needToSkip}**.\nНужно ещё **${needToSkip - (voted + 1)} голос(а)(ов)** для пропуска текущего трека!`);
    }
}

module.exports = SkipCommand;
