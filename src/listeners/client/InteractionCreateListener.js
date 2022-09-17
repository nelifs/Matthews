const BaseListener = require('../../structures/BaseListener');

class InteractionCreateListener extends BaseListener {
    constructor() {
        super('InteractionCreate', { event: 'interactionCreate' });
        this.rows = [];
    }

    findButton(interaction, id) {
        return interaction.message.components[0].components.find((x) => x.customId === id);
    }

    async run(client, interaction) {
        if (!interaction.isButton()) return;
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

        /*interaction.message.components.map(rows => {
            rows.components.forEach(button => {
                    switch (button.customId) {
                        case 'pauseResume':
                            if (player.paused === true) {
                                button.emoji.name = '⏸';
                            } else {
                                button.emoji.name = '▶';
                            }
                            break;
                        case 'repeat':
                            if (player.loop !== 'track') {
                                button.emoji.name = '🔂';
                            } else if (player.loop !== 'queue') {
                                button.emoji.name = '🔁';
                            } else if (player.loop !== 'none') {
                                button.emoji.name = '🔃';
                            }
                    }
                }
            );
            return this.rows = rows;
        });*/

        switch (interaction.customId) {
            case 'pauseResume':
                if (player.paused === true) {
                    player.pause(false);
                    interaction.component.setEmoji(client.customEmojis.music.pause);
                } else {
                    player.pause(true);
                    interaction.component.setEmoji(client.customEmojis.music.play);
                }
                interaction.update({ embeds: [interaction.message.embeds[0]], components: interaction.message.components });
                break;
            case 'skip':
                player.skip();
                interaction.update({ embeds: [interaction.message.embeds[0]] });
                break;
            case 'stop':
                player.data.get("message")?.delete();
                player.data.get("messageVoice")?.delete();
                await client.deletePlayerTempInformation(player);
                client.manager.players.delete(interaction.guild.id);
                player.destroy();
                interaction.update({ embeds: [interaction.message.embeds[0]] });
                break;
            case 'repeat':
                if (player.loop === 'none') {
                    player.setLoop('track');
                    interaction.component.setEmoji(client.customEmojis.music.repeatTrack);
                }
                else if (player.loop === 'track') {
                    player.setLoop('queue');
                    interaction.component.setEmoji(client.customEmojis.music.repeatQueue);
                }
                else if (player.loop === 'queue') {
                    player.setLoop('none');
                    interaction.component.setEmoji(client.customEmojis.music.repeatOff);
                }
                interaction.update({ embeds: [interaction.message.embeds[0]], components: interaction.message.components });
                break;
            case 'volumeUp':
                if(player.volume >= 2) return;
                player.setVolume((player.volume * 100) + 10);
                interaction.update({ embeds: [interaction.message.embeds[0]] });
                break;
            case 'volumeDown':
                if(player.volume <= 0) return;
                player.setVolume((player.volume * 100) - 10);
                interaction.update({ embeds: [interaction.message.embeds[0]] });
                break;
        }
    }
}

module.exports = InteractionCreateListener;
