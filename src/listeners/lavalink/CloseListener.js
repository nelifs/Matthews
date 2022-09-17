const BaseListener = require('../../structures/BaseListener');

class CloseListener extends BaseListener {
    constructor() {
        super('Close', { event: 'close', type: 1 });
    }

    async run(client, node, code, reason) {
        client.logger.warn(`Node ${node}`, `Closed with code ${code}. Reason: ${reason !== false ? 'No reason' : reason}`)
    }
}

module.exports = CloseListener;
