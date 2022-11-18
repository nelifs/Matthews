const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

class VolumeCommand extends BaseCommand {
    constructor() {
        super('manage-dj-role', {
            data: new SlashCommandBuilder()
                .setName('manage-dj-role')
                .setDescription('Установить роль диджея')
                .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR | Permissions.FLAGS.MANAGE_GUILD)
                .addRoleOption(option =>
                    option.setName('роль')
                        .setDescription('Роль диджея')
                        .setRequired(true))
        });
    }

    async run(client, message, args) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id });
        const role = message.options.getRole('роль');

        if (guild.djStatus === false) return client.replyError(message, 'Режим диджея отключён. Сначала включите его чтобы задать роль диджея.')

        await client.replySuccess(message, 'Роль диджея успешно установлена. Новая роль: **<@&' + role + '>**')
        await client.database.setOne('guilds', { id: message.guild.id }, { djRole: role.id });
    }
}

module.exports = VolumeCommand;

