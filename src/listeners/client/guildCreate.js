const BaseListener = require('../../structures/BaseListener')

class ErrorListener extends BaseListener {
    constructor() {
        super('Error', {event: 'error'});
    }

    async run(client, guild) {
        const dbGuild = await client.database.findOne('guilds', { id: guild.id });
        if (!dbGuild) {
            client.database.insert('guilds', [{
                id: guild.id,
                infinityPlaying: false,
            }]);

            client.color = client.colors.main;
        }
    }
}

module.exports = ErrorListener;
