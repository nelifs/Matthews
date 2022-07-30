const client = require('../index');
const fetch = require('node-fetch');

class APIService {
    constructor() {
        this.url = 'http://localhost:8000/stats'
        this.retryAttemptsCount = 0;
    }

    async send(retryAttempts) {
        if (retryAttempts === this.retryAttemptsCount) return;
        fetch(this.url + `?ping=${client.ws.ping}`
            + `&servers=${client.guilds.cache.size}`
            + `&users=${client.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0)}`
            + `&channels=${client.channels.cache.size}`
            + `&emojis=${client.emojis.cache.size}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).catch(() => {
            client.logger.error('API Service', 'There was an error sending statistics to ' + url + ' Attempt #' + parseInt(this.retryAttemptsCount+1))
            this.retryAttemptsCount++
        })
    }

    async sendStatisticsOne(retryAttempts) {
        await client.logger.send('API Service', '')
        await this.send(retryAttempts)
    }

    async sendStatisticsInterval(time, retryAttempts) {
        await client.logger.send('API Service', '')
        setInterval(() => {
            this.send(retryAttempts);
        }, time);
    }
}

module.exports = APIService;
