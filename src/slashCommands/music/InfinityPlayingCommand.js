const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class InfinityPlayingCommand extends BaseCommand {
    constructor() {
        super('24/7', {
            data: new SlashCommandBuilder()
                .setName('24-7')
                .setDescription('Бот не будет выходить из канала когда в нём никого не осталось')
        });
    }

    async run(client, message) {
        const guild = await client.database.findOne('guilds', { id: message.guild.id });

        if (guild.infinityPlaying === false) {
            await client.database.setOne('guilds', { id: message.guild.id }, { infinityPlaying: true });
            await client.replySuccess(message, 'Режим 24/7 успешно **включён**');
        } else if (guild.infinityPlaying === true) {
            await client.database.setOne('guilds', { id: message.guild.id }, { infinityPlaying: false });
            await client.replySuccess(message, 'Режим 24/7 успешно **отключён**');
        } else await client.replyError(message, 'Ошибка использования команды, попробуйте позже');
    }
}

module.exports = InfinityPlayingCommand;
