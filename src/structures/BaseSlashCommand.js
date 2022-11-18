class BaseCommand {
    constructor(name, options = {}) {
        this.data = options.data;
        this.public = options.public ?? true;
        this.name = name;
        this.dir = options.dir;
        this.fileName = options.fileName;
        this.memberPermissions = options.memberPermissions || ['SEND_MESSAGES'];
    }
}

module.exports = BaseCommand;
