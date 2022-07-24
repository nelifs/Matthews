const {MessageEmbed} = require('discord.js');
const BaseCommand = require('../../structures/BaseCommand');

class HelpCommand extends BaseCommand {
    constructor() {
        super('help', {
            category: 'Information',
            usage: '[название команды]',
            examples: ['mute`\nПолучаем информацию о команде мута', '`\nЕсли ничего не написать после команды, то бот выдаст полный список команд'],
            description: 'Список всех доступных команд'
        });
    }

    async run(client, message, args) {
        if (args[0]) {
            const cmd = client.commands.get(args[0]) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[1]));
            if (!cmd || cmd.category === 'dev') return message.reply(`${client.customEmojis.no} Неизвестная команда!`);

            const embed = new MessageEmbed()
                .setAuthor({name: `Информация о команде ${args[0]}`})
                .setTitle(cmd.description)
                .setDescription(`
${process.env.DEFAULTPREFIX + cmd.detailedDescription}

**Использование**
\`${process.env.DEFAULTPREFIX + cmd.name + ' ' + cmd.usage}\`
                `)
                .setTimestamp(Date.now())
                .setColor(client.colors.main);
                for (let i = 0; i < cmd.examples.length; i++) {
                    embed.addField('Пример #' + parseInt(i+1), '`' + process.env.DEFAULTPREFIX + cmd.name + ' ' + cmd.examples[i])
                }
            await message.reply({embeds: [embed]});
        } else if (!args[1]) {
            const embed = new MessageEmbed()
                .setTitle('Список команд')
                .setThumbnail(client.user.avatarURL({size: 1024, format: 'png'}))
            client.categories.pop()
            for (let i = 1; i < client.categories.length; i++) {
                embed.addField(i + `# ${client.categories[i]}`, `${client.commands.filter(c => c.category === client.categories[i].toString()).map(d => `**${d.name}** — ${d.description}`).join('\n')}`)
            }
            embed.setFooter({text: `Публичных команд: ${client.commands.filter((c) => c.category !== 'dev').size}`})
            embed.setTimestamp()
            embed.setColor(client.colors.main);
            await message.reply({embeds: [embed]});
        }
    }
}

module.exports = HelpCommand;