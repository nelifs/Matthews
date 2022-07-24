const BaseCommand = require('../../structures/BaseCommand')
const {inspect} = require('util');
const {MessageAttachment, MessageActionRow, MessageButton, Formatters} = require('discord.js');

class EvalCommand extends BaseCommand {
    constructor() {
        super('eval', {
            category: 'dev',
            description: 'умная штука типо',
            aliases: ['e']
        });
    }

    async run(client, message, args) {
        let code = args.join(' ');
        code = code.replace(/(```(.+)?)?/g, '');

        let mess;
        let evaled;
        let row;

        try {
            const before = process.hrtime.bigint();
            evaled = await eval(code);
            const after = process.hrtime.bigint();
            const time = (parseInt(after - before) / 1000000).toFixed(3);
            if (typeof evaled !== 'string') {
                evaled = inspect(evaled);
            }

            row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('file')
                        .setLabel('Файлик в лс')
                        .setEmoji(client.customEmojis.yes)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('delete')
                        .setLabel('Удоли')
                        .setEmoji(client.customEmojis.no)
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('deletAall')
                        .setLabel('Удоли всё')
                        .setEmoji(client.customEmojis.no)
                        .setStyle('DANGER')
                )

            const file = new MessageAttachment(Buffer.from(evaled), 'result.txt')


            if (!code) {
                await message.reply('bruh');
            } else {
                if (code.startsWith('"') && code.endsWith('"')) return message.channel.send(code.split('"', 2)[1])
                if (evaled.length > 2000) return mess = await message.channel.send({
                    content: `Слишком длинный результат бла-бла-бла... Выслан файл... \`${time}ms\``,
                    files: [file],
                    components: [row]
                })
                mess = await message.channel.send({
                    content: `\`${time}ms\`\n${Formatters.codeBlock('js', evaled.replace(client.token, 'Хуй тебе, а не токен'))}`,
                    components: [row]
                });
            }
        } catch (error) {
            await message.error(`\`...ms\`\n${Formatters.codeBlock('js', error)}`);
        }

        const collector = message.channel.createMessageComponentCollector({
            filter: i => i.user.id === process.env.OWNERID,
            time: 600000
        });

        collector.on('collect', b => {
            try {
                if (b.customId === 'file') return message.author.send({files: [new MessageAttachment(Buffer.from(evaled), 'result.txt')]}) && mess.delete();
                if (b.customId === 'delete') return mess?.delete();
                if (b.customId === 'deleteAll') return mess?.delete() && message.delete();
            } catch (err) {
                console.error(err)
            }
        })

    }
}

module.exports = EvalCommand;