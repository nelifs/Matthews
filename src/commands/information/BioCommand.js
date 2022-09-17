const BaseCommand = require('../../structures/BaseCommand');

class InfoCommand extends BaseCommand {
    constructor() {
        super('bio', {
            description: 'Установить/Удалить информацию осебе',
            usage: '<текст>',
            category: 'information',
            examples: ['меня зовут Матюша` — Установит текст "меня зовут Матюша" в поле осебе']
        })
    }

    async run(client, message, args) {
        const bio = args.join(' ')

        if(!bio) return client.replyError(message, 'Для установки поля осебе нужно ввести текст');

        await client.replySuccess(message, 'Поле осебе установлено. Для проверки введите команду **user**')
        client.database.setOne('users', { id: message.author.id }, { bio: bio });
    }
}

module.exports = InfoCommand;
