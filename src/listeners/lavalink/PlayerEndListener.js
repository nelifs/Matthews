const BaseListener = require('../../structures/BaseListener');

class PlayerEndListener extends BaseListener {
    constructor() {
        super('PlayerEnd', { event: 'playerEnd', type: 2 });
    }

    async run(client, player) {
        client.logger.send('MusicManager', 'Player ended in guild ' + player.guildId + '. Deleting temporary information...');
        await client.deletePlayerTempInformation(player);
    }
}

module.exports = PlayerEndListener;
