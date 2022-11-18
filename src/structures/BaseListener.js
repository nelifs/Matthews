class BaseListener {
    constructor(name, options = {}) {
        this.name = name;
        this.ws = options.ws || false;
        this.type = options.type || 0;
        this.event = options.event || null;
    }
}

module.exports = BaseListener;
