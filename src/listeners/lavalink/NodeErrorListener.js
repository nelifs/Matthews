const BaseListener = require('../../structures/BaseListener');

class NodeErrorListener extends BaseListener {
    constructor() {
        super('NodeError', { event: 'nodeError', type: 1 });
    }

    async run(client, node, error) {
        client.logger.error(`Lavalink node ${node.options.name}`, `Node "${node.options.id} / ${node.options.identifier}" encountered an error: \n${error}`)
    }
}

module.exports = NodeErrorListener;