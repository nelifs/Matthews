const BaseCommand = require('../../structures/BaseCommand');
const { Permissions } = require('discord.js');

class WarnCommand extends BaseCommand {
    constructor() {
        super('warn', {
            category: 'moderation',
            description: 'Выдать предупреждение участнику с указанной причиной'
        });
    }

    async run(client, message, args) {
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.mentions.repliedUser;
        args.shift()
        const reason = args.join(" ");

        if(!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.error("У Вас недостаточно прав для использования этой команды");
        if(!user) return message.error("Чтобы выдать предупреждение, нужно указать участника");

        const dbUser = await client.database.findOne('users', { guildId: message.guild.id, id: message.author.id })
        if (!user) {
            client.database.insert('user', [{guildId: message.guild.id, id: message.author.id, warns: []}])
        }

        if(user === undefined) return message.error("Такого участника не существует. Проверьте написание команды");
        if(user.id === message.author.id) return message.error("Выдать предупреждение самому себе нельзя");
        if(user.bot === true) return message.error("Нельзя выдать предупреждение боту");
        if(!reason) return message.error("Для выдачи предупреждения необходимо указать причину");

        await client.database.pushOne('users',{ guildId: message.guild.id, id: message.author.id }, {warns: {
                    initiator: message.author.id,
                    reason: reason,
                    timestamp: Date.now()
                }})
            .catch(err => message.channel.send(client.customEmojis.no + ' Невозможно добавить предупреждение в базу-данных, повторите ввод команды'));

        await message.reply(client.customEmojis.yes + ' `#' + (dbUser.warns.length+1) + `\` Участнику ${user} было успешно выдано предупреждение`);

        /*user.send('Получено предупреждение `#' + (dbUser.warns.length+1) + '` с сервера `' + message.guild.name + '` `(' + message.guild.id + ')`' + ' по причине: `' + reason + '` от `' + message.author.tag + '` `(' + message.author.id + ')`')
            .then()
            .catch(err => message.channel.send(client.customEmojis.no + ' Невозможно отправить инфомацию в личные сообщения, пропускаю...'));*/
    }
}

module.exports = WarnCommand;
