const BaseListener = require('../../structures/BaseListener');

class PlayerEmptyListener extends BaseListener {
    constructor() {
        super('PlayerEmpty', { event: 'playerEmpty', type: 2 });
    }

    async run(client, player) {
        client.logger.send('MusicManager', 'Player empty in guild ' + player.guildId + '. Deleting temporary information...');
        await client.deletePlayerTempInformation(player);
    }
}

module.exports = PlayerEmptyListener;
