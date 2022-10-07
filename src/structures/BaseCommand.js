class BaseCommand {
    constructor(name, options = {}) {
        this.name = name;
        this.debug = options.debug || false;
        this.description = options.description || 'Команда не имеет описания';
        this.usage = options.usage || 'Команда не имеет примеров использования';
        this.examples = options.examples || [];
        this.public = options.public || false
        this.category = options.category;
        this.aliases = options.aliases || [];
        this.memberPermissions = options.memberPermissions || ['SEND_MESSAGES'];
        this.botPermissions = options.botPermissions || ['SEND_MESSAGES'];
    }
}

module.exports = BaseCommand;
