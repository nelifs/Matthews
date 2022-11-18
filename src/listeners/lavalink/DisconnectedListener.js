const BaseListener = require('../../structures/BaseListener');

class DisconnectedListener extends BaseListener {
    constructor() {
        super('Disconnected', { event: 'disconnected', type: 1 });
    }

    async run(client, node, reason) {
        client.logger.error(`Node ${node}`, `Disconnected. Reason: ${reason !== false ? 'No reason' : reason}`)
    }
}

module.exports = DisconnectedListener;
