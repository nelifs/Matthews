class BaseCommand {
    constructor(name, options = {}) {
        this.name = name;
        this.description = options.description || 'Команда не имеет описания';
        this.detailedDescription = options.description || '';
        this.public = options.public || false
        this.category = options.category;
        this.usage = options.usage || 'Команда не имеет примеров использования';
        this.aliases = options.aliases || [];
        this.examples = options.examples || [];
        this.memberPermissions = options.memberPermissions || [];
        this.clientPermissions = options.clientPermissions || [];
    }
}

module.exports = BaseCommand;