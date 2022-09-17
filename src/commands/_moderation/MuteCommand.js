const BaseCommand = require('../../structures/BaseCommand');
const { Permissions } = require('discord.js');

class MuteCommand extends BaseCommand {
    constructor() {
        super('mute', {
            category: 'moderation',
            description: 'Замутить участника на указанное время с указанной причиной',
            aliases: ['m']
        });
    }

    async run(client, message, args) {
        //const dbGuild = await Guild.findOne({ id: message.guild.id, guildID: message.guild.id  });

        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.mentions.repliedUser;
        const time = args[1];
        args.shift()
        args.shift()
        const reason = args.join(" ");
        //const muteRole = message.guild.roles.cache.get(dbGuild.muteRole);

        function timeParser() {
            if(time.endsWith('s' || 'sec' || 'с' || 'сек')) return parseInt(time) * 1000;
            if(time.endsWith('m' || 'min' || 'м' || 'мин')) return parseInt(time) * 1000 * 60;
            if(time.endsWith('h' || 'hrs' || 'ч' || 'час')) return parseInt(time) * 1000 * 60 * 60;
            if(time.endsWith('d' || 'day' || 'д' || 'день')) return parseInt(time) * 1000 * 60 * 60 * 24;
            if(time.endsWith('w' || 'week' || 'н' || 'нед')) return parseInt(time) * 1000 * 60 * 60 * 24 * 7;
            if(time.endsWith('month' || 'мес')) return parseInt(time) * 1000 * 60 * 60 * 24 * 7 * 30;
            if(time.endsWith('y' || 'yrs' || 'г' || 'год')) return parseInt(time) * 1000 * 60 * 60 * 24 * 7 * 30 * 365;
        }

        if(!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.error("У Вас недостаточно прав для использования этой команды");
        if(dbGuild.muteRole === "") return message.error("На сервере отсутствует роль для мута. Для создания используйте команду `muterole`")
        if(!user) return message.error("Чтобы выдать мут, нужно указать участника");
        if(user === undefined) return message.error("Такого участника не существует. Проверьте написание команды");
        if(user.id === message.author.id) return message.error("Выдать мут самому себе нельзя");
        if(user.bot === true) return message.error("Нельзя выдать мут боту");
        if(!reason) return message.error("Для выдачи мута необходимо указать причину");

        /*const dbUser = await User.findOne({ id: user.id });

        if(!dbUser) {
            await User.create({
                id: user.id,
                guildId: message.guild.id
            });
        }

        await dbUser.updateOne({
            unmuteTime: Date.now()+timeParser()
        })
            .then()
            .catch(err => message.channel.send(client.customEmojis.no + ' Невозможно добавить дату окончания мута в базу-данных, повторите ввод команды'));

        user.roles.add(muteRole)
            .then(message.reply(client.customEmojis.yes + `Участнику ${user} был выдан мут`))*/

        user.send('Получен мут с сервера `' + message.guild.name + '` `(' + message.guild.id + ')`' + ' по причине: `' + reason + '` на срок `' + time + '` (<t:' + ((timeParser() + Date.now()) / 1000).toFixed(0) + ':R>)' + ' от `' + message.author.tag + '` `(' + message.author.id + ')`')
            .then()
            .catch(err => message.channel.send(client.customEmojis.no + ' Невозможно отправить инфомацию в личные сообщения, пропускаю...'));
    }
}

module.exports = MuteCommand;
