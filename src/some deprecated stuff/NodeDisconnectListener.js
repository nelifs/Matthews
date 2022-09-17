const BaseListener = require('../structures/BaseListener');

class NodeDisconnectListener extends BaseListener {
    constructor() {
        super('NodeDisconnect', { event: 'nodeDisconnect', type: 1 });
    }

    async run(client, node) {
        client.logger.error(`Lavalink node ${node.options.name}`, `Node "${node.options.id} / ${node.options.identifier}" disconnected`)
    }
}

module.exports = NodeDisconnectListener;
