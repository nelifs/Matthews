const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

class VolumeCommand extends BaseCommand {
    constructor() {
        super('manage-dj-perms', {
            data: new SlashCommandBuilder()
                .setName('manage-dj-perms')
                .setDescription('Включение или отключение режима диджея')
                .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR | Permissions.FLAGS.MANAGE_GUILD)
                .addStringOption(option =>
                    option.setName('право')
                        .setDescription('Выберите право для настройки')
                        .addChoices(
                            { name: 'Пропуск треков без голосования', value: 'forceskip' },
                            { name: 'Остановка воспроизведения', value: 'stop' },
                            { name: 'Изменение громкости', value: 'volume' },
                            { name: 'Возможность ставить трек на паузу', value: 'pause' },
                            { name: 'Возможность продолжить воспроизведение', value: 'resume' },
                            { name: 'Переключение режима повтора', value: 'repeat' },
                        )
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('действие')
                        .setDescription('Добавить или убрать это право у диджеев. Убрав вы разрешите всем участникам использовать эту команду')
                        .addChoices(
                            { name: 'Добавить', value: 'add' },
                            { name: 'Убрать', value: 'delete' }
                        )
                        .setRequired(true))
        });
    }

    async run(client, interaction) {
        const guild = await client.database.findOne('guilds', { id: interaction.guild.id });
        const perms = interaction.options.getString('право');
        const action = interaction.options.getString('действие');

        if (guild.djPerms.includes(perms) && action === 'add') return client.replyError(interaction, 'Данное право уже имеется.')
        if (!guild.djPerms.includes(perms) && action === 'delete') return client.replyError(interaction, 'Вы пытаетесь удалить право, которого нет.')

        await client.replySuccess(interaction, `Права успешно изменены.\nТекущие настройки прав вы можете посмотреть в команде **/settings**`)
        if (action === 'add') await client.database.pushOne('guilds', { id: interaction.guild.id }, { djPerms: perms });
        else await client.database.pullOne('guilds', { id: interaction.guild.id }, { djPerms: perms });
    }
}

module.exports = VolumeCommand;

