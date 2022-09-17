const BaseListener = require('../structures/BaseListener');

class TrackEndListener extends BaseListener {
    constructor() {
        super('TrackEnd', { event: 'trackEnd', type: 1 });
    }

    async run(client, player) {
        const activePlayer = client.activePlayers;
        clearInterval(activePlayer.get(player.textChannel).interval);
        activePlayer.delete(player.textChannel);
    }
}

module.exports = TrackEndListener;
