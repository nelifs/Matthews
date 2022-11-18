const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class RepeatCommand extends BaseCommand {
    constructor() {
        super('repeat', {
            data: new SlashCommandBuilder()
                .setName('repeat')
                .setDescription('Повтор очереди/трека')
                .addStringOption(option =>
                    option.setName('режим')
                        .setDescription('Режим повтора')
                        .addChoices(
                            { name: 'Трек', value: 'track' },
                            { name: 'Очередь', value: 'queue' },
                            { name: 'Отключить', value: 'off' },
                        )
                        .setRequired(true))
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);
        const choice = message.options.getString('режим')

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const voice = message.member.voice.channelId;

        if (!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if (choice === 'queue') {
            player.setLoop('queue');
            return client.replySuccess(message, `Повтор очереди **включен**`);
        } else if (choice === 'track') {
            player.setLoop('track');
            return client.replySuccess(message, `Повтор трека **включен**`);
        } else if (choice === 'off') {
            player.setLoop('none');
            return client.replySuccess(message, `Повтор **выключен**`);
        }
    }
}

module.exports = RepeatCommand;
