const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../structures/BaseCommand');

class HelpCommand extends BaseCommand {
    constructor() {
        super('help', {
            category: 'information',
            aliases: ['h', 'hlep'],
            usage: '<название команды>',
            examples: ['prefix` — Информация о команде prefix', '` — Если ничего не написать после команды, то бот выдаст полный список команд'],
            description: 'Список всех доступных команд'
        });
    }

    async run(client, message, args) {
        const prefix = await client.database.findOne('guilds', { id: message.guild.id })?.prefix ?? process.env.DEFAULTPREFIX;

        if (args[0]) {
            const cmd = client.commands.get(args[0]) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[1]));
            if (!cmd || cmd.category === 'dev') return message.reply(`${client.customEmojis.no} В моём списке нет такой команды`);

            const embed = new MessageEmbed()
                .setAuthor({ name: `Информация о команде ${args[0]}` })
                .setDescription(`
**Псевдонимы**                
${cmd.aliases.length === 0 ? 'Команда не имеет псевдонимов' : '`' + cmd.aliases.join('; ') + '`'}
**Описание**                
\`${cmd.description}\`
**Использование**
${cmd.usage.startsWith('Команда не имеет') ? cmd.usage : '`' + prefix + cmd.name + ' ' + cmd.usage + '`'}
                `)
                .setTimestamp(Date.now())
                .setColor(client.color);
            for (let i = 0; i < cmd.examples.length; i++) {
                embed.addField('Пример #' + parseInt(i + 1), '`' + process.env.DEFAULTPREFIX + cmd.name + ' ' + cmd.examples[i]);
            }
            await message.reply({ embeds: [embed] });
        } else if (!args[1]) {

            let categoryName;

            function parseCategoryName(name) {
                switch (name) {
                    case 'music':
                        categoryName = 'Музыка';
                        break;
                    case 'information':
                        categoryName = 'Информация';
                        break;
                    case 'settings':
                        categoryName = 'Настройки';
                        break;
                    case 'moderation':
                        categoryName = 'Модерация';
                        break;
                    case 'utility':
                        categoryName = 'Утилиты';
                        break;
                    default:
                        categoryName = 'Неизвестная категория';
                        break;
                }
            }

            const embed = new MessageEmbed()
                .setTitle('Список команд')
                .setThumbnail(client.user.avatarURL({ size: 1024, format: 'png' }));
            for (let i = 0; i < client.categories.length; i++) {
                parseCategoryName(client.categories[i]);
                embed.addField(`${categoryName}`, `${client.commands.filter(c => c.category === client.categories[i].toString()).map(d => `**${d.name}**`).join(', ')}`);
            }
            embed.setFooter({ text: `Публичных команд: ${client.commands.filter((c) => c.category !== 'dev').size}` });
            embed.setTimestamp();
            embed.setColor(client.color);
            await message.reply({ embeds: [embed] });
        }
    }
}

module.exports = HelpCommand;
