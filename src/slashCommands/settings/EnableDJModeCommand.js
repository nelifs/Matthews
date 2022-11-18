const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

class VolumeCommand extends BaseCommand {
    constructor() {
        super('manage-dj', {
            data: new SlashCommandBuilder()
                .setName('manage-dj')
                .setDescription('Включение или отключение режима диджея')
                .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR | Permissions.FLAGS.MANAGE_GUILD)
        });
    }

    async run(client, message) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id });

        if (guild.djStatus === false) {
            await client.database.setOne('guilds', { id: message.guild.id }, { djStatus: true });
            await client.replySuccess(message, ('Режим диджея успешно **включён**'));
        } else if (guild.djStatus === true) {
            await client.database.setOne('guilds', { id: message.guild.id }, { djStatus: false });
            await client.replySuccess(message, ('Режим диджея успешно **отключён**'));
        } else await client.replyError(message, 'Ошибка использования команды, попробуйте позже');
    }
}

module.exports = VolumeCommand;

