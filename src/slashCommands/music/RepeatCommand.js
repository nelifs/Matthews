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

    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id);
        const choice = interaction.options.getString('режим')

        if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

        const voice = interaction.member.voice.channelId;

        if (!voice) return client.replyError(interaction, `Для начала Вам нужно зайти в канал <#${player.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(interaction, `Вы не в том же канале, что и бот <#${player.textId}>`);

        if (choice === 'queue') {
            player.setLoop('queue');
            return client.replySuccess(interaction, `Повтор очереди **включен**`);
        } else if (choice === 'track') {
            player.setLoop('track');
            return client.replySuccess(interaction, `Повтор трека **включен**`);
        } else if (choice === 'off') {
            player.setLoop('none');
            return client.replySuccess(interaction, `Повтор **выключен**`);
        }
    }
}

module.exports = RepeatCommand;
