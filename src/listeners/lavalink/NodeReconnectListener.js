const BaseListener = require('../../structures/BaseListener');

class NodeReconnectListener extends BaseListener {
    constructor() {
        super('NodeReconnect', { event: 'nodeReconnect', type: 1 });
    }

    async run(client, node) {
        client.logger.warn(`Lavalink node ${node.options.name}`, `Node "${node.options.id} / ${node.options.identifier}" reconnecting...`)
    }
}

module.exports = NodeReconnectListener;