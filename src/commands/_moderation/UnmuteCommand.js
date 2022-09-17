const BaseCommand = require('../../structures/BaseCommand');
const { Permissions } = require('discord.js');

class UnmuteCommand extends BaseCommand {
    constructor() {
        super('unmute', {
            category: 'moderation',
            description: 'Снять мут с участника'
        });
    }

    async run(client, message, args) {

    }
}

module.exports = UnmuteCommand;
