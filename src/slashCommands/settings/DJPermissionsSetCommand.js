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

    async run(client, message) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id });
        const perms = message.options.getString('право');
        const action = message.options.getString('действие');

        if (guild.djPerms.includes(perms) && action === 'add') return client.replyError(message, 'Данное право уже имеется.')
        if (!guild.djPerms.includes(perms) && action === 'delete') return client.replyError(message, 'Вы пытаетесь удалить право, которого нет.')

        await client.replySuccess(message, `Права успешно изменены.\nТекущие настройки прав вы можете посмотреть в команде **/settings**`)
        if (action === 'add') await client.database.pushOne('guilds', { id: message.guild.id }, { djPerms: perms });
        else await client.database.pullOne('guilds', { id: message.guild.id }, { djPerms: perms });
    }
}

module.exports = VolumeCommand;

