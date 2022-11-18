const BaseListener = require('../../structures/BaseListener');
const { MessageEmbed } = require('discord.js');

class VoiceStateUpdateListener extends BaseListener {
    constructor() {
        super('VoiceStateUpdate', { event: 'voiceStateUpdate' });
    }

    async run(client, oldState, newState) {
        const guild = oldState?.guild;
        const dbGuild = await client.database.findOne('guilds', { id: guild.id })
        const player = client.manager.players.get(guild.id);

        if (dbGuild.infinityPlaying === true) return;

        if (guild?.me?.voice.channelId) {
            if (guild.channels.cache.get(guild.me.voice.channelId).members.size <= 1) {
                const embed = new MessageEmbed()
                    .setTitle('Покидаю канал')
                    .setDescription('Все участники покинули канал, выхожу в след за ними...')
                    .setColor(client.colors.success);
                guild.channels.cache.get(player.textId).send({ embeds: [embed] });
                clearInterval(player.data.get('interval'));
                player.data.get('messageVoice').delete();
                player.data.get('message').delete();
                player.destroy();
            }
        }

    }
}

module.exports = VoiceStateUpdateListener;
