const BaseListener = require('../../structures/BaseListener');

class RawListener extends BaseListener {
    constructor() {
        super('Raw', {event: 'raw'});
    }

    async run(client, d) {
        //client.manager.updateVoiceState(d);
    }
}


module.exports = RawListener;