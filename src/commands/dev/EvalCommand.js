const BaseCommand = require('../../structures/BaseCommand');
const { inspect } = require('util');
const { MessageAttachment, MessageActionRow, MessageButton, Formatters } = require('discord.js');
const fetch = require('node-fetch');

class EvalCommand extends BaseCommand {
    constructor() {
        super('eval', {
            category: 'dev',
            debug: false,
            description: 'умная штука типо',
            aliases: ['e', 'ev'],
            botPermissions: ['SEND_MESSAGES'],
            memberPermissions: ['SEND_MESSAGES']
        });
    }

    async run(client, message, args) {
        let code = args.join(' ');
        code = code.replace(/(```(.+)?)?/g, '');

        let executedCode;

        try {
            const before = process.hrtime.bigint();
            executedCode = await eval(code);
            const after = process.hrtime.bigint();
            const time = (parseInt(after - before) / 1000000).toFixed(3);
            if (typeof executedCode !== 'string') {
                executedCode = inspect(executedCode);
            }

            const file = new MessageAttachment(Buffer.from(executedCode), 'arbuz.txt');


            if (!code) {
                await message.reply('bruh');
            } else {
                if (code.startsWith('"') && code.endsWith('"')) return message.channel.send(code.split('"', 2)[1]) && message.delete();

                if (executedCode.length > 2000) return await message.channel.send({
                    content: `Слишком длинный результат бла-бла-бла... Выслан файл... \`${time}ms\``,
                    files: [file]
                });

                const executedFixedCode = executedCode.replace(client.token, 'Хрен тебе, а не токен').replace(process.env.DATABASEURL, 'арбуз');

                await message.channel.send({
                    content: `\`${time}ms\`\n**${Formatters.codeBlock('js', executedFixedCode)}**`,
                });
            }
        } catch (error) {
            await message.error(`\`...ms\`\n**${Formatters.codeBlock('js', error)}**`);
            console.error('ERROR [ EVAL ]: \n' + error);
        }

    }
}

module.exports = EvalCommand;
