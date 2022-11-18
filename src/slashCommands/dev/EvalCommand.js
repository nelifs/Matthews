const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { inspect } = require('util');
const { MessageAttachment, MessageActionRow, MessageButton, Formatters } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class EvalCommand extends BaseCommand {
    constructor() {
        super('eval', {
            data: new SlashCommandBuilder()
                .setName('eval')
                .setDescription('???')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('???')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('ephemeral')
                        .setDescription('???')
                        .setRequired(false))
        });
    }

    async run(client, message, args) {
        let ephemeral = message.options.getBoolean('ephemeral') ?? true;
        let code = message.options.getString('code');
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
                await message.reply({ content: 'bruh', ephemeral: true });
            } else {
                if (code.startsWith('"') && code.endsWith('"')) return message.channel.send(code.split('"', 2)[1]) && message.delete();

                if (executedCode.length > 2000) return await message.reply({
                    content: `Слишком длинный результат бла-бла-бла... Выслан файл... \`${time}ms\``,
                    files: [file],
                    ephemeral: ephemeral
                });

                const executedFixedCode = executedCode.replace(client.token, 'Хрен тебе, а не токен').replace(process.env.DATABASEURL, 'арбуз');

                await message.reply({
                    content: `\`${time}ms\`\n**${Formatters.codeBlock('js', executedFixedCode)}**`, ephemeral: ephemeral
                });
            }
        } catch (error) {
            await message.reply({
                content: `\`...ms\`\n**${Formatters.codeBlock('js', error)}**`, ephemeral: ephemeral
            });
            console.error('ERROR [ EVAL ]: \n' + error);
        }

    }
}

module.exports = EvalCommand;
