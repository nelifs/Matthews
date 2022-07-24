const BaseListener = require('../../structures/BaseListener');

class QueueEndListener extends BaseListener {
    constructor() {
        super('QueueEnd', { event: 'queueEnd', type: 1 });
    }

    async run(client, player) {
        setTimeout(() => {
            activePlayer.delete(player.textChannel);
        }, 3000)
        const activePlayer = client.activePlayers;
        clearInterval(activePlayer.get(player.textChannel).interval);

        // client.channels.cache.get(player.textChannel).messages.fetch(activePlayer.get(player.textChannel).messageId).edit({content: 'Воспроизведение закончено', embeds: []})
        client.channels.cache.get(player.textChannel).send(`${client.customEmojis.neutral} Очередь пуста, воспроизведение закончено`);
    }
}

module.exports = QueueEndListener;