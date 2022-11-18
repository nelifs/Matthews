const BaseListener = require('../../structures/BaseListener');

class PlayerEmptyListener extends BaseListener {
    constructor() {
        super('PlayerEmpty', { event: 'playerEmpty', type: 2 });
    }

    async run(client, player) {
        client.logger.send('MusicManager', 'Player empty in guild ' + player.guildId + '. Deleting temporary information...');
        clearInterval(player.data.get('interval'));
        player.data.get('messageVoice')?.delete();
        player.data.get('message')?.delete();
        player.data.delete('messageVoice');
        player.data.delete('message');
        player.data.delete('interval');
    }
}

module.exports = PlayerEmptyListener;
