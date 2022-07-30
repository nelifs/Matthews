const client = require('../index');
const fetch = require('node-fetch');
const url = 'http://localhost:8000/stats'
let retryAttemptsCount = 0;

class SendStatistics {
    constructor() {
    }

    async send(time, retryAttempts) {
        function update() {
            if (retryAttempts === retryAttemptsCount) return;
            fetch(url + `?ping=${client.ws.ping}
            &servers=${client.guilds.cache.size}
            &users=${client.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0)}
            &channels=${client.channels.cache.size}
            &emojis=${client.emojis.cache.size}`,
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).catch(() => {
                client.logger.error('API', 'There was an error sending statistics to ' + url + ' Attempt #' + parseInt(retryAttemptsCount+1))
                retryAttemptsCount++
            })
        }

        setInterval(() => {
            update()
        }, time);
    }
}

module.exports = SendStatistics;
