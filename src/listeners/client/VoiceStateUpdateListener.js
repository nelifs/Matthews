const BaseListener = require('../../structures/BaseListener');
const { MessageEmbed } = require('discord.js');

class VoiceStateUpdateListener extends BaseListener {
    constructor() {
        super('VoiceStateUpdate', { event: 'voiceStateUpdate' });
    }

    run(client, oldState, newState) {
        const guild = oldState?.guild;
        const player = client.manager.players.get(guild.id);
        if (guild?.me?.voice.channelId) {
            if (guild.channels.cache.get(guild.me.voice.channelId).members.size <= 1) {
                const embed = new MessageEmbed()
                    .setTitle('Упс :(')
                    .setDescription('Все участники покинули канал, выхожу в след за ними...')
                    .setColor(client.color)
                guild.channels.cache.get(player.textId).send({ embeds: [embed] });
                void client.deletePlayerTempInformation(player);
                player.destroy();
            }
        }

    }
}

module.exports = VoiceStateUpdateListener;
