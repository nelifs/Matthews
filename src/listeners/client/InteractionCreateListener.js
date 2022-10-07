const BaseListener = require('../../structures/BaseListener');
const CommandExecutor = require('../../services/CommandExecutorService');
const { MessageEmbed } = require('discord.js');

class InteractionCreateListener extends BaseListener {
    constructor() {
        super('InteractionCreate', { event: 'interactionCreate' });
        this.rows = [];
    }

    findButton(interaction, id) {
        return interaction.message.components[0].components.find((x) => x.customId === id);
    }

    async run(client, interaction) {

        const guild = await client.database.findOne('guilds', { id: interaction.guild.id });
        if (!guild) {
            client.database.insert('guilds', [{
                id: interaction.guild.id,
                infinityPlaying: false,
            }]);
        }
        
        if (interaction.isButton()) {
            const player = client.manager.players.get(interaction.guild.id);
            const voice = interaction.member.voice.channelId;

            if (!player) return;
            if (!voice) return interaction.reply({
                content: `${client.customEmojis.no} Для начала Вам нужно зайти в канал <#` + interaction.guild.me.voice.channelId + '>',
                ephemeral: true
            });
            if (voice !== player.shoukaku.connection.channelId) return interaction.reply({
                content: `${client.customEmojis.no} Вы не в том же канале, что и бот`,
                ephemeral: true
            });

            switch (interaction.customId) {
                case 'pauseResume':
                    if (player.paused === true) {
                        player.pause(false);
                        interaction.component.setEmoji(client.customEmojis.music.pause);
                    } else {
                        player.pause(true);
                        interaction.component.setEmoji(client.customEmojis.music.play);
                    }
                    interaction.update({
                        embeds: [interaction.message.embeds[0]],
                        components: interaction.message.components
                    });
                    break;
                case 'skip':
                    const skipped = new MessageEmbed()
                        .setTitle('Трек пропущен')
                        .setDescription('Трек **' + player.queue.current.title + '** пропущен по запросу **<@' + interaction.user + '>**')
                        .setColor(client.colors.main)
                    interaction.channel.send({ embeds: [skipped] })
                    player.data.get('message').delete();
                    player.data.get('messageVoice').delete();
                    player.skip();
                    interaction.update({
                        embeds: [interaction.message.embeds[0]],
                        components: []
                    });
                    break;
                case 'stop':
                    const stopped = new MessageEmbed()
                        .setTitle('Воспроизведение остановлено')
                        .setDescription('Воспроизведение трека **' + player.queue.current.title + '** остановлено по запросу **<@' + interaction.user + '>**')
                        .setColor(client.colors.main)
                    interaction.channel.send({ embeds: [stopped] })
                    player.data.get('message').delete();
                    player.data.get('messageVoice').delete();
                    await client.deletePlayerTempInformation(player);
                    player.destroy();
                    interaction.update({
                        embeds: [interaction.message.embeds[0]],
                        components: []
                    });
                    break;
                case 'repeat':
                    if (player.loop === 'none') {
                        player.setLoop('track');
                        interaction.component.setEmoji(client.customEmojis.music.repeatTrack);
                    } else if (player.loop === 'track') {
                        player.setLoop('queue');
                        interaction.component.setEmoji(client.customEmojis.music.repeatQueue);
                    } else if (player.loop === 'queue') {
                        player.setLoop('none');
                        interaction.component.setEmoji(client.customEmojis.music.repeatOff);
                    }
                    interaction.update({
                        embeds: [interaction.message.embeds[0]],
                        components: interaction.message.components
                    });
                    break;
                case 'volumeUp':
                    if (player.volume >= 2) return;
                    player.setVolume((player.volume * 100) + 10);
                    interaction.update({ embeds: [interaction.message.embeds[0]] });
                    break;
                case 'volumeDown':
                    if (player.volume <= 0) return;
                    player.setVolume((player.volume * 100) - 10);
                    interaction.update({ embeds: [interaction.message.embeds[0]] });
                    break;
            }
        } else {
            try {
                const executor = new CommandExecutor(interaction, client);
                return executor.runCommand();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = InteractionCreateListener;
