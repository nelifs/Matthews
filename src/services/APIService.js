const client = require('../index');
const fetch = require('node-fetch');

const url = 'http://localhost:8000/stats'
let retryAttemptsCount = 0;

async function sendMethod(retryAttempts) {
    if (retryAttempts === retryAttemptsCount) return;
    fetch(url + `?ping=${client.ws.ping}`
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
        client.logger.error('API Service', 'There was an error sending statistics to ' + url + ' :: Attempt #' + parseInt(retryAttemptsCount + 1))
        retryAttemptsCount++
    })
}

class APIService {
    async sendStatisticsOne(retryAttempts) {
        await client.logger.send('API Service', 'Statistics successfully sent to ' + url)
        try {
            await sendMethod(retryAttempts);
        } catch(err) {
            await client.logger.error('API Service', 'There was an error sending statistics to ' + url)
            retryAttemptsCount++
        }
    }

    async sendStatisticsInterval(interval, retryAttempts) {
        if (retryAttempts === retryAttemptsCount) return client.logger.send('API Service', 'Attempts to send statistics are exhausted');
        await client.logger.send('API Service', 'Started sending statistics to ' + url + ' Interval: ' + interval)
        setInterval(async () => {
            try {
                await sendMethod(retryAttempts);
            } catch(err) {
                await client.logger.error('API Service', 'There was an error sending statistics to ' + url + ' :: Attempt #' + parseInt(retryAttemptsCount+1) + '\n' + err)
                retryAttemptsCount++
            }
        }, interval);
    }
}

module.exports = APIService;
