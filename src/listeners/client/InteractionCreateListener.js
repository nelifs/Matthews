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
            await client.database.insert('guilds', [{
                id: interaction.guild.id,
                infinityPlaying: false,
                djStatus: false,
                djRole: 0,
                djPerms: [],
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
                    if (!interaction.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                        if (guild.djPerms.includes('pause' || 'resume')) return client.replyError(interaction, 'Вы не можете использовать это действие из-за настройки прав.', false, true);
                    }
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
                /*case 'previous':
                    if (!interaction.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                        if (guild.djPerms.includes('skip')) return client.replyError(interaction, 'Вы не можете использовать это действие из-за настройки прав.', false, true);
                    }
                    const needToPrevious = (interaction.guild.channels.cache.get(interaction.member.voice.channelId).members.size / 2).toFixed(0);
                    const voted1 = player.data.get('votesToPrevious');
                    const membersVoted1 = player.data.get('membersVotedToPrevious');

                    player.data.set('votesToPrevious', voted1 + 1);
                    player.data.set('membersVotedToPrevious', membersVoted1 + interaction.user.id);

                    if (guild.djStatus === true && interaction.member.roles.cache.has(guild.djRole)) {
                        player.skip();
                        clearInterval(player.data.get('interval'));
                        player.data.get('messageVoice').delete();
                        player.data.get('message').delete();
                        player.data.delete('messageVoice');
                        player.data.delete('message');
                        player.data.delete('interval');
                        return client.replySuccess(interaction, `Трек **[${player.queue.current.title}](${player.queue.current.uri})** запущен заново по запросу диджея <@` + message.user + '>');
                    }

                    if (membersVoted1.includes(interaction.user.id)) return client.replyError(interaction, 'Вы уже проголосовали за повтор предыдущего трека.');

                    if (voted1 >= needToPrevious - 1) {
                        clearInterval(player.data.get('interval'));
                        player.data.delete('messageVoice');
                        player.data.delete('message');
                        player.skip();
                        return client.replySuccess(interaction, `Трек **[${player.queue.current.title}](${player.queue.current.uri})** повторён по результатам голсования. \nПоследний проголосовавший: **${interaction.user}**`);
                    } else client.reply(interaction, 'Голосование за повтор', `Проголосовало **${voted1 + 1}/${needToPrevious}**.\nНужно ещё **${needToPrevious - (voted1 + 1)} голос(а)(ов)** для повтора предыдущего трека!`);
                    interaction.update({
                        embeds: [interaction.message.embeds[0]],
                        components: []
                    });
                    break;*/
                case 'skip':
                    if (!interaction.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                        if (guild.djPerms.includes('skip')) return client.replyError(interaction, 'Вы не можете использовать это действие из-за настройки прав.', false, true);
                    }
                    const needToSkip = (interaction.guild.channels.cache.get(interaction.member.voice.channelId).members.size / 2).toFixed(0);
                    const voted = player.data.get('votesToSkip');
                    const membersVoted = player.data.get('membersVotedToSkip');

                    player.data.set('votesToSkip', voted + 1);
                    player.data.set('membersVotedToSkip', membersVoted + interaction.user.id);

                    if (guild.djStatus === true && interaction.member.roles.cache.has(guild.djRole)) {
                        player.skip();
                        clearInterval(player.data.get('interval'));
                        player.data.get('messageVoice').delete();
                        player.data.get('message').delete();
                        player.data.delete('messageVoice');
                        player.data.delete('message');
                        player.data.delete('interval');
                        return client.replySuccess(interaction, `Трек **[${player.queue.current.title}](${player.queue.current.uri})** пропущен по запросу диджея <@` + message.user + '>');
                    }

                    if (membersVoted.includes(interaction.user.id)) return client.replyError(interaction, 'Вы уже проголосовали за пропуск.');

                    if (voted >= needToSkip - 1) {
                        clearInterval(player.data.get('interval'));
                        player.data.delete('messageVoice');
                        player.data.delete('message');
                        player.skip();
                        return client.replySuccess(interaction, `Трек **[${player.queue.current.title}](${player.queue.current.uri})** пропущен по результатам голсования. \nПоследний проголосовавший: **${interaction.user}**`);
                    } else client.reply(interaction, 'Голосование за пропуск', `Проголосовало **${voted + 1}/${needToSkip}**.\nНужно ещё **${needToSkip - (voted + 1)} голос(а)(ов)** для пропуска текущего трека!`);
                    interaction.update({
                        embeds: [interaction.message.embeds[0]],
                        components: []
                    });
                    break;
                case 'stop':
                    if (!interaction.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                        if (guild.djPerms.includes('stop')) return this.client.replyError(interaction, 'Вы не можете использовать это действие из-за настройки прав.', false, true);
                    }
                    const stopped = new MessageEmbed()
                        .setTitle('Воспроизведение остановлено')
                        .setDescription(`Воспроизведение трека **[${player.queue.current.title}](${player.queue.current.uri})** остановлено по запросу **${interaction.user}**`)
                        .setColor(client.colors.main);
                    interaction.channel.send({ embeds: [stopped] });
                    clearInterval(player.data.get('interval'));
                    player.data.get('message').delete();
                    player.data.get('messageVoice').delete();
                    player.destroy();
                    interaction.update({
                        embeds: [interaction.message.embeds[0]],
                        components: []
                    });
                    break;
                case 'repeat':
                    if (!interaction.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                        if (guild.djPerms.includes('repeat')) return client.replyError(interaction, 'Вы не можете использовать это действие из-за настройки прав.', false, true);
                    }
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
                    if (!interaction.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                        if (guild.djPerms.includes('volume')) return client.replyError(interaction, 'Вы не можете использовать это действие из-за настройки прав.', false, true);
                    }
                    if (player.volume >= 2) return;
                    player.setVolume((player.volume * 100) + 10);
                    interaction.update({ embeds: [interaction.message.embeds[0]] });
                    break;
                case 'volumeDown':
                    if (!interaction.member.roles.cache.has(guild.djRole) && guild.djStatus === true) {
                        if (guild.djPerms.includes('volume')) return client.replyError(interaction, 'Вы не можете использовать это действие из-за настройки прав.', false, true);
                    }
                    if (player.volume <= 0) return;
                    player.setVolume((player.volume * 100) - 10);
                    interaction.update({ embeds: [interaction.message.embeds[0]] });
                    break;
            }
        } else {
            try {
                if (interaction.channel.type === 'DM') return;
                const executor = new CommandExecutor(interaction, client);
                return executor.runCommand();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = InteractionCreateListener;
