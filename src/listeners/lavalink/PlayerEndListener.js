const BaseListener = require('../../structures/BaseListener');

class PlayerEndListener extends BaseListener {
    constructor() {
        super('PlayerEnd', { event: 'playerEnd', type: 2 });
    }

    async run(client, player) {
        client.logger.send('MusicManager', 'Player ended in guild ' + player.guildId + '. Deleting temporary information...');
        clearInterval(player.data.get('interval'));
        player.data.get('messageVoice').delete();
        player.data.get('message').delete();
        player.data.delete('messageVoice');
        player.data.delete('message');
        player.data.delete('interval');
    }
}

module.exports = PlayerEndListener;
