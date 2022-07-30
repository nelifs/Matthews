const BaseListener = require('../../structures/BaseListener');
//const MuteManager = require('../../managers/MuteManager');
//const muteManager = new MuteManager()
//const APIService = require('../../services/APIService');
//const { sendStatisticsInterval } = new APIService()

class ReadyListener extends BaseListener {
    constructor() {
        super('Ready', {event: 'ready'});
    }

    async run(client) {
        client.logger.send(`Successfully logged as ${client.user.tag}`);
        if(client.shard) client.user.setActivity(`Meow! Shard #${client.shard.ids[0]+1}`)
        else client.user.setActivity(`Meow!`)
        //muteManager.check(client, 5000);
        //await sendStatisticsInterval(3000, 15);

        client.manager.init(client.user.id)
    }
}

module.exports = ReadyListener;
