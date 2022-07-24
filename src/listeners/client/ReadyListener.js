const BaseListener = require('../../structures/BaseListener');
//const MuteManager = require('../../managers/MuteManager');
//const muteManager = new MuteManager()

class ReadyListener extends BaseListener {
    constructor() {
        super('Ready', {event: 'ready'});
    }

    async run(client) {
        client.logger.send(`Successfully logged as ${client.user.tag}`);
        client.user.setActivity(`Meow`);
        client.logger.send('Lavalink manager', 'Manager successfully initialized')

        //muteManager.check(client, 5000);
    }
}

module.exports = ReadyListener;