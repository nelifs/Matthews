const BaseCommand = require('src/structures/BaseCommand.js');
const { Permissions, Role } = require('discord.js');

class UnmuteCommand extends BaseCommand {
    constructor() {
        super('mass-role', {
            aliases: ['massrole'],
            category: 'moderation',
            description: 'Выдать определённым участникам указанную роль',
            botPermissions: ['MANAGE_ROLES'],
            memberPermissions: ['MANAGE_ROLES', 'MANAGE_GUILD']
        });
    }

    async run(client, message, args) {
        const action = args[0];
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
        const membersRole = message.mentions.roles.at(0) || message.guild.roles.cache.get(args[1]);
        const members = args[1];

        if(action === 'add') {
            await message.reply('Начинаю процесс выдачи ролей...')
            console.log(members instanceof Role);
            message.guild.members.cache.forEach(r => {
                if (members === 'everyone') return setTimeout(() => {
                    r.roles.add(role)
                }, 2000)
                else if (message.guild.roles.cache.get(membersRole.id)) return setTimeout(() => {
                    message.guild.members.cache.filter(s => s.roles.cache.has(members)).forEach(d => d.roles.add(role))
                }, 2000)
            })
            await message.success('Указанным участникам успешно выдана роль: **' + role.name + '**')
        } else if(action === 'remove') {
            await message.reply('Начинаю процесс забирания ролей...')
            message.guild.members.cache.forEach(r => {
                if (members === 'everyone') return setTimeout(() => {
                    r.roles.remove(role)
                }, 2000)
                else if (message.guild.roles.cache.get(membersRole.id)) return setTimeout(() => {
                    message.guild.members.cache.filter(s => s.roles.cache.has(members)).forEach(d => d.roles.remove(role))
                }, 2000)
            })
            await message.success('У указанных участников успешно забрана роль: **' + role.name + '**')
        }
    }
}

module.exports = UnmuteCommand;
