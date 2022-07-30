/*const BaseCommand = require('../../structures/BaseCommand');
const { Permissions } = require('discord.js');

class MuteroleCommand extends BaseCommand {
    constructor() {
        super('mute-role', {
            category: 'Settings',
            description: 'Создать/Назначить роль для мута',
            aliases: ['mrole', 'muterole']
        });
    }

    async run(client, message, args) {
        const dbGuild = await Guild.findOne({ id: message.guild.id });

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply(client.customEmojis.no + " У Вас недостаточно прав для использования этой команды");
        if(message.guild.roles.cache.get(dbGuild.muteRole) && args[0] != 'delete') return message.reply(client.customEmojis.no + ' Роль мута уже задана')
        if(!args[0]) return message.reply(client.customEmojis.no + ' Для назначения роли нужно указать её айди или упомянуть. Для создания новой роли мута нужно дописать аргумент `new`')

        if(args[0] == "new") {
            if(!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.reply(client.customEmojis.no + ' У меня недостаточно прав для создания роли')

            let newrole;
            message.guild.roles.create({
                name: "Q-Muted",
                color: "#080202",
                position: 5
            })
                .then(async (role) => {

                    message.reply(client.customEmojis.yes + ' Новая роль мута успешно создана: <@&' + role.id + '> `(' + role.id + ')`')

                    await dbGuild.updateOne({
                        muteRole: role.id
                    })
                        .then(true)
                        .catch(err => message.channel.send(client.customEmojis.no + ' Невозможно добавить роль в базу-данных, повторите ввод команды'));


                    message.guild.channels.cache.forEach(c => {
                        c.permissionOverwrites.edit(role.id, { SEND_MESSAGES: false })
                    });
                })
                .catch(err => client.customEmojis.no + ' Ошибка создания роли, повторите попытку ввода команды снова')
        } else if(args[0] == 'delete') {
            if(!message.guild.roles.cache.get(dbGuild.muteRole)) return msg.reply(client.customEmojis.no + 'Роль мута отсутсвует, удаление невозможно')
            if(!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.reply(client.customEmojis.no + ' У меня недостаточно прав для создания роли')

            message.guild.roles.cache.get(dbGuild.muteRole).delete()
                .then()
                .catch(err => message.channel.send(client.customEmojis.no + ' Ошибка удаления роли, повторите попытку ввода команды'))

            await dbGuild.updateOne({
                muteRole: 0
            })
                .then(message.reply(client.customEmojis.yes + ' Роль мута успешно удалена'))
                .catch(err => message.channel.send(client.customEmojis.no + ' Невозможно удалить роль из базы-данных, повторите ввод команды'));
        } else if(args[0]) {
            if(!role) msg.reply(client.customEmojis.no + ' Вам нужно указать роль для её назначения')
            if(role == undefined) return message.reply(client.customEmojis.no + ' Вы указали несуществующую роль, проверьте написание аргументов')

            await dbGuild.updateOne({
                muteRole: role.id
            })
                .then(message.reply(client.customEmojis.yes + ' Новая роль успешно задана: <&' + role + '>'))
                .catch(err => message.channel.send(client.customEmojis.no + ' Невозможно добавить роль в базу-данных, повторите ввод команды'));
        }
    }
}

module.exports = MuteroleCommand;*/