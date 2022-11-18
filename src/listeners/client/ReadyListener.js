const BaseListener = require('../../structures/BaseListener');
//const MuteManager = require('../../managers/MuteManager');
//const muteManager = new MuteManager()
const APIService = require('../../services/APIService');
const { sendStatisticsInterval } = new APIService()
const SDC = require("@megavasiliy007/sdc-api");
const sdc = new SDC(process.env.API_TOKEN);

class ReadyListener extends BaseListener {
    constructor() {
        super('Ready', {event: 'ready'});
    }

    async run(client) {
        client.logger.send(`Successfully logged as ${client.user.tag}`);
        if(client.shard) client.user.setActivity(`Meow! Shard #${client.shard.ids[0]+1}`);
        else client.user.setActivity(`Meow :3`);
        //sdc.setAutoPost(client);
        console.timeEnd();
    }
}

module.exports = ReadyListener;
