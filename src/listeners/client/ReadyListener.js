const BaseListener = require('../../structures/BaseListener');
//const MuteManager = require('../../managers/MuteManager');
//const muteManager = new MuteManager()
const APIService = require('../../services/APIService');
const { sendStatisticsInterval } = new APIService()
const SDC = require("@megavasiliy007/sdc-api");
const sdc = new SDC('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk0NjQ5MTUzNTI3NTQ1ODY4MCIsImlhdCI6MTY2MTI3NTk0M30.3fqIc57phhsamjCV_y2Ybk1M4sZB9jzowNXLD9HycRI');

class ReadyListener extends BaseListener {
    constructor() {
        super('Ready', {event: 'ready'});
    }

    async run(client) {
        client.logger.send(`Successfully logged as ${client.user.tag}`);
        if(client.shard) client.user.setActivity(`Meow! Shard #${client.shard.ids[0]+1}`);
        else client.user.setActivity(`Meow!`);
        sdc.setAutoPost(client);
        //muteManager.check(client, 5000);
        //await sendStatisticsInterval(3000, 5);
    }
}

module.exports = ReadyListener;
