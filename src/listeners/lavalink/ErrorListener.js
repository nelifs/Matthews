const BaseListener = require('../../structures/BaseListener');

class ErrorListener extends BaseListener {
    constructor() {
        super('Error', { event: 'error', type: 1 });
    }

    async run(client, node, err) {
        client.logger.error(`Node ${node}`, err )
    }
}

module.exports = ErrorListener;
