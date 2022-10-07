const BaseListener = require('../../structures/BaseListener');

class PlayerEndListener extends BaseListener {
    constructor() {
        super('PlayerEnd', { event: 'playerEnd', type: 2 });
    }

    async run(client, player) {
        client.logger.send('MusicManager', 'Player ended in guild ' + player.guildId + '. Deleting temporary information...');
        player.data.get('message').delete();
        player.data.get('messageVoice').delete();
        await client.deletePlayerTempInformation(player);
    }
}

module.exports = PlayerEndListener;
