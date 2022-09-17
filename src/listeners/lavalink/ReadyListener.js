const BaseListener = require('../../structures/BaseListener');

class ReadyListener extends BaseListener {
    constructor() {
        super('Ready', { event: 'ready', type: 1 });
    }

    async run(client, node) {
        client.logger.send(`Node ${node}`, `Successfully connected.`)
    }
}

module.exports = ReadyListener;
