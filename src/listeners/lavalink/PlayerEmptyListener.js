const BaseListener = require('../../structures/BaseListener');

class PlayerEmptyListener extends BaseListener {
    constructor() {
        super('PlayerEmpty', { event: 'playerEmpty', type: 2 });
    }

    async run(client, player) {
        client.logger.send('MusicManager', 'Player empty in guild ' + player.guildId + '. Deleting temporary information...');
        player.data.get('message').delete();
        player.data.get('messageVoice').delete();
        await client.deletePlayerTempInformation(player);
    }
}

module.exports = PlayerEmptyListener;
