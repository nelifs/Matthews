const BaseListener = require('../../structures/BaseListener');

class RateLimitListener extends BaseListener {
    constructor() {
        super('RateLimit', { event: 'rateLimit' });
        this.triggers = [];
    }

    run(client, d) {
        this.triggers.push(Date.now() + 60000);
        console.log(d);
        console.log(this.triggers);

        this.triggers.forEach(r => {
            if (r <= Date.now()) return this.triggers.shift();

            if (d.method === 'post' && this.triggers.length >= 3) {
                const guildId = client.channels.cache.get(d.route.split('/')[2]).guild.id;
                const player = client.manager.players.get(guildId);
                void client.deletePlayerTempInformation(player);
                client.logger.warn('MusicManager Rate-Limit', `Cache player from guild ${guildId} cleared due to exceeding rate-limits`)
                this.triggers = [];
            }
        });
    }
}

module.exports = RateLimitListener;
