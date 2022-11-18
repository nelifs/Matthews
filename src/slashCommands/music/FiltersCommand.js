const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class PauseCommand extends BaseCommand {
    constructor() {
        super('filters', {
            data: new SlashCommandBuilder()
                .setName('filters')
                .setDescription('Применить фильтр к треку')
                .addStringOption(option =>
                    option.setName('фильтр')
                        .setDescription('Выберите фильтр для применения')
                        .addChoices(
                            { name: 'Bassboost', value: 'bassboost' },
                            { name: '8D', value: '8d' },
                            { name: 'Earrape', value: 'earrape' },
                            { name: 'Karaoke', value: 'karaoke' },
                            { name: 'Electronic', value: 'electronic' },
                            { name: 'Radio', value: 'radio' },
                            { name: 'Soft', value: 'soft' },
                            { name: 'Speed', value: 'speed' },
                            { name: 'Party', value: 'party' },
                            { name: 'Vaporwave', value: 'vaporwave' },
                            { name: 'Pop', value: 'pop' },
                            { name: 'Nightcore', value: 'nightcore' },
                            { name: 'Очистить', value: 'clear' },
                        )
                        .setRequired(true))
        });
    }

    async run(client, message) {
        const player = client.manager.players.get(message.guild.id);
        const filter = message.options.getString('фильтр')

        if (!player) return client.replyError(message, `На этом сервере не запущен ни один плеер`);

        const voice = message.member.voice.channelId;

        if (!voice) return client.replyError(message, `Для начала Вам нужно зайти в канал <#${player.shoukaku.textId}>`);
        if (voice !== player.shoukaku.connection.channelId) return client.replyError(message, `Вы не в том же канале, что и бот <#${player.shoukaku.textId}>`);

        await client.replySuccess(message, filter !== 'clear' ? 'Фильтр **' + filter + '** применяется... Это может занять пару секунд.' : 'Очистка фильтров... Это может занять пару секунд.')
        switch (filter) {
            case '8d':
                await player.shoukaku.setFilters({
                    rotation: { rotationHz: 0.2 }
                })
                break;
            case 'bassboost':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 0, gain: 0.1 },
                        { band: 1, gain: 0.1 },
                        { band: 2, gain: 0.05 },
                        { band: 3, gain: 0.05 },
                        { band: 4, gain: -0.05 },
                        { band: 5, gain: -0.05 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: -0.05 },
                        { band: 8, gain: -0.05 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0.05 },
                        { band: 11, gain: 0.05 },
                        { band: 12, gain: 0.1 },
                        { band: 13, gain: 0.1 },
                    ],
                })
                break;
            case 'earrape':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 0, gain: 0.25 },
                        { band: 1, gain: 0.5 },
                        { band: 2, gain: -0.5 },
                        { band: 3, gain: -0.25 },
                        { band: 4, gain: 0 },
                        { band: 6, gain: -0.025 },
                        { band: 7, gain: -0.0175 },
                        { band: 8, gain: 0 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0.0125 },
                        { band: 11, gain: 0.025 },
                        { band: 12, gain: 0.375 },
                        { band: 13, gain: 0.125 },
                        { band: 14, gain: 0.125 },
                    ],
                })
                break;
            case 'karaoke':
                await player.shoukaku.setFilters({
                    rotation: { rotationHz: 0.2 },
                })
                break;
            case 'vaporwave':
                await player.shoukaku.setFilters({
                    guildId: message.guild.id,
                    equalizer: [
                        { band: 1, gain: 0.3 },
                        { band: 0, gain: 0.3 },
                    ],
                    timescale: { pitch: 0.5 },
                    tremolo: { depth: 0.3, frequency: 14 },
                })
                break;
            case 'radio':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 0, gain: -0.25 },
                        { band: 1, gain: 0.48 },
                        { band: 2, gain: 0.59 },
                        { band: 3, gain: 0.72 },
                        { band: 4, gain: 0.56 },
                        { band: 5, gain: 0.15 },
                        { band: 6, gain: -0.24 },
                        { band: 7, gain: -0.24 },
                        { band: 8, gain: -0.16 },
                        { band: 9, gain: -0.16 },
                        { band: 10, gain: 0 },
                        { band: 11, gain: 0 },
                        { band: 12, gain: 0 },
                        { band: 13, gain: 0 },
                        { band: 14, gain: 0 },
                    ],
                })
                break;
            case 'soft':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 0, gain: 0 },
                        { band: 1, gain: 0 },
                        { band: 2, gain: 0 },
                        { band: 3, gain: 0 },
                        { band: 4, gain: 0 },
                        { band: 5, gain: 0 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: -0.25 },
                        { band: 9, gain: -0.25 },
                        { band: 10, gain: -0.25 },
                        { band: 11, gain: -0.25 },
                        { band: 12, gain: -0.25 },
                        { band: 13, gain: -0.25 },
                        { band: 14, gain: -0.25 },
                    ],
                })
                break;
            case 'electronic':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 0, gain: 0.375 },
                        { band: 1, gain: 0.35 },
                        { band: 2, gain: 0.125 },
                        { band: 3, gain: 0 },
                        { band: 4, gain: 0 },
                        { band: 5, gain: -0.125 },
                        { band: 6, gain: -0.125 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: 0.25 },
                        { band: 9, gain: 0.125 },
                        { band: 10, gain: 0.15 },
                        { band: 11, gain: 0.2 },
                        { band: 12, gain: 0.25 },
                        { band: 13, gain: 0.35 },
                        { band: 14, gain: 0.4 },
                    ],
                })
                break;
            case 'pop':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 0, gain: -0.25 },
                        { band: 1, gain: 0.48 },
                        { band: 2, gain: 0.59 },
                        { band: 3, gain: 0.72 },
                        { band: 4, gain: 0.56 },
                        { band: 5, gain: 0.15 },
                        { band: 6, gain: -0.24 },
                        { band: 7, gain: -0.24 },
                        { band: 8, gain: -0.16 },
                        { band: 9, gain: -0.16 },
                        { band: 10, gain: 0 },
                        { band: 11, gain: 0 },
                        { band: 12, gain: 0 },
                        { band: 13, gain: 0 },
                        { band: 14, gain: 0 },
                    ],
                })
                break;
            case 'speed':
                await player.shoukaku.setFilters({
                    timescale: {
                        speed: 1.501,
                        pitch: 1.245,
                        rate: 1.921,
                    },
                })
                break;
            case 'party':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 0, gain: -1.16 },
                        { band: 1, gain: 0.28 },
                        { band: 2, gain: 0.42 },
                        { band: 3, gain: 0.5 },
                        { band: 4, gain: 0.36 },
                        { band: 5, gain: 0 },
                        { band: 6, gain: -0.3 },
                        { band: 7, gain: -0.21 },
                        { band: 8, gain: -0.21 },
                    ],
                })
                break;
            case 'nightcore':
                await player.shoukaku.setFilters({
                    equalizer: [
                        { band: 1, gain: 0.3 },
                        { band: 0, gain: 0.3 },
                    ],
                    timescale: { pitch: 1.2 },
                    tremolo: { depth: 0.3, frequency: 14 },
                })
                break;
            case 'clear':
                await player.shoukaku.setFilters({})
                break;
        }
        await client.replySuccess(message, filter !== 'clear' ? 'Фильтр **' + filter + '** успешно применён' : 'Фильтры очищены', true)
    }
}

module.exports = PauseCommand;
