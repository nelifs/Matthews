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

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const voice = message.member.voice.channelId;

        if(!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if(voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if(!player.paused) return client.replyError(message, `${client.customEmojis.no} Плеер не стоит на паузе`)

        player.pause(false);
        return client.replySuccess(message, `Воспроизведение запущено по запросу **${message.user}**`)
    }
}

module.exports = ResumeCommand;


