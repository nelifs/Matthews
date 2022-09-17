const BaseListener = require('../../structures/BaseListener')

class WarnListener extends BaseListener {
    constructor() {
        super('Warn', {event: 'warn'});
    }

    run(client, d) {
        client.logger.warn(d)
    }
}

module.exports = WarnListener;
