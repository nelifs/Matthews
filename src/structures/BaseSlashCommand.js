class BaseCommand {
    constructor(name, options = {}) {
        this.data = options.data;
        this.name = name;
        this.debug = options.debug || false;
        this.memberPermissions = options.memberPermissions || ['SEND_MESSAGES'];
    }
}

module.exports = BaseCommand;
