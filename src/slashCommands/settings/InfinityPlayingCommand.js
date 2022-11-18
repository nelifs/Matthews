const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

class InfinityPlayingCommand extends BaseCommand {
    constructor() {
        super('24/7', {
            data: new SlashCommandBuilder()
                .setName('24-7')
                .setDescription('Бот не будет выходить из канала когда в нём никого не осталось')
                .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR | Permissions.FLAGS.MANAGE_GUILD)
        });
    }

    async run(client, interaction) {
        const guild = await client.database.findOne('guilds', { id: interaction.guild.id });

        if (guild.infinityPlaying === false) {
            await client.database.setOne('guilds', { id: interaction.guild.id }, { infinityPlaying: true });
            await client.replySuccess(interaction, 'Режим 24/7 успешно **включён**');
        } else if (guild.infinityPlaying === true) {
            await client.database.setOne('guilds', { id: interaction.guild.id }, { infinityPlaying: false });
            await client.replySuccess(interaction, 'Режим 24/7 успешно **отключён**');
        } else await client.replyError(interaction, 'Ошибка использования команды, попробуйте позже');
    }
}

module.exports = InfinityPlayingCommand;
