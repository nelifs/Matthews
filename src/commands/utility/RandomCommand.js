const BaseCommand = require('../../structures/BaseCommand');

class InfoCommand extends BaseCommand {
    constructor() {
        super('random', {
            description: 'Случайное число',
            aliases: ['rand'],
            category: 'utility',
            usage: '<числа мин-макс>',
            examples: ['1 10` — Выдаст случайное число в указанном диапазоне (1-10)', '10` — Выдаст случайное число от 0 до указанного числа (10)']
        })
    }

    async run(client, message, args) {
        const input = args.slice(0, 2);
        let max = parseInt(input[1]);
        let min = parseInt(input[0]);
        if (!max) {
            max = parseInt(input[0]);
            min = 0;
        }
        let output = Math.floor(Math.random() * (max - min + 1)) + min

        if (!input || input.length === 0) return client.replyError(message, 'Введите минимальное и максимальное (опционально) число')

        await client.reply(message, 'Рандом!', output.toString())
    }
}

module.exports = InfoCommand;
