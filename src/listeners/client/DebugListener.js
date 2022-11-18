const BaseListener = require('../../structures/BaseListener');

class DebugListener extends BaseListener {
    constructor() {
        super('Debug', { event: 'debug' });
    }

    run(client, d) {
        if (client.debug === false) return;
        client.logger.debug(d);
    }
}

module.exports = DebugListener;
