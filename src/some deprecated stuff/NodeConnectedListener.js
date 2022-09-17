const BaseListener = require('../structures/BaseListener');

class NodeConnectListener extends BaseListener {
    constructor() {
        super('NodeConnect', { event: 'nodeConnect', type: 1 });
    }

    async run(client, node) {
        client.logger.send(`Lavalink node ${node.options.name}`, `Node "${node.options.id} / ${node.options.identifier}" connected`)
    }
}

module.exports = NodeConnectListener;
