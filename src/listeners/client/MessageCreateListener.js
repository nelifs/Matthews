const BaseListener = require('../../structures/BaseListener');
const CommandExecutor = require('../../services/CommandExecutorService');


class MessageCreateListener extends BaseListener {
    constructor() {
        super('MessageCreate', { event: 'messageCreate' });
    }

    async run(client, message) {
        if (message.author.bot) return;

        const user = await client.database.findOne('users', { guildId: message.guild.id, id: message.author.id }, true);
        if (!user) {
            client.database.insert('users', [{
                guildId: message.guild.id,
                id: message.author.id,
                //currentXp: 0,
                //level: 0,
                //xpToNextLevel: 5 * (!user?.level ? 0 : user?.level) ^ 2 + 50 * ((!user?.level ? 0 : user?.level) + 1) + 100
            }]);
        }


        await client.database.setOne('users',
            { guildId: message.guild.id, id: message.author.id },
            { lastMessageTimestamp: Date.now(), lastMessageContent: message.content });


        const guild = await client.database.findOne('guilds', { id: message.guild.id });
        if (!guild) {
            client.database.insert('guilds', [{
                id: message.guild.id,
                infinityPlaying: false,
            }]);

            client.color = client.colors.main;
        }

        /*if(guild.levelsEnabled === true) {
            const minXp = 15;
            const maxXp = 25;
            const xp = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
            client.database.setOne('users', {
                guildId: message.guild.id,
                id: message.author.id
            }, {
                currentXp: (!user?.currentXp ? 0 : user?.currentXp) + xp,
                level: user.level,
            });
            //}

            if (user?.currentXp >= user?.xpToNextLevel) {
                client.database.setOne('users', {
                    guildId: message.guild.id,
                    id: message.author.id
                }, {
                    level: user?.level + 1,
                    xpToNextLevel: user.currentXp + (15 * (!user?.level ? 0 : user?.level) ^ 2 + 150 * ((!user?.level ? 0 : user?.level) + 1) + 200)
                })
                && await message.reply('Вы получили новый уровень! Текущий уровень **' + (user?.level + 1) + '**');
            }
        }*/

        /*if (message.content.startsWith('<@' + client.user.id + '>' || '<!@' + client.user.id + '>')) {
            await message.reply('Привет! Мой префикс на этом сервере: `' + prefix + '`\nДля получения полного списка команд пропишите `' + prefix + 'help`');
        }*/
    }
}

module.exports = MessageCreateListener;
