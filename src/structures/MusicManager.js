const client = require('../index');
const { Connectors } = require("shoukaku");
const { Kazagumo } = require('kazagumo');
const Spotify = require('kazagumo-spotify');

module.exports = class extends Kazagumo {
    constructor() {
        super();
    }

    async deleteAllPlayers(deleteIfPaused) {
        this.players.forEach(r => {
            if(deleteIfPaused === true) r.destroy()
            else if(deleteIfPaused === false && r.paused === true) r.destroy();
        })
        await client.logger.send('MusicManager', `Successfully deleted all ${deleteIfPaused === true ? '' : 'paused '}players`)
    }

    async deleteTempInformation(player) {
        player.data.get("message")?.delete();
        player.data.get("messageVoice")?.delete();
        clearInterval(player.data.get('interval'));
        player.data.delete('messageVoice');
        player.data.delete('message');
        player.data.delete('interval');
        await client.logger.send('MusicManager', 'Successfully deleted all temporary information')
    }
};
