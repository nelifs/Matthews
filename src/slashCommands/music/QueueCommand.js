const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class QueueCommand extends BaseCommand {
    constructor() {
        super('queue', {
            data: new SlashCommandBuilder()
                .setName('queue')
                .setDescription('Очередь проигрывания')
                .addIntegerOption(option =>
                    option.setName('страница')
                        .setMinValue(0)
                        .setDescription('Страница очереди')
                        .setRequired(false))
        });
    }

    async run(client, interaction) {
        try {
            const pageQ = interaction.options.getInteger('страница') ?? 1;
            const player = client.manager.players.get(interaction.guild.id);
            if (!player) return client.replyError(interaction, `На этом сервере не запущен ни один плеер`);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel('<')
                        .setStyle('SECONDARY')
                        .setCustomId('pageDown'),
                    new MessageButton()
                        .setLabel('x')
                        .setStyle('SECONDARY')
                        .setCustomId('delete'),
                    new MessageButton()
                        .setLabel('>')
                        .setStyle('SECONDARY')
                        .setCustomId('pageUp')
                );

            const queue = player.queue;
            const embed = new MessageEmbed()
                .setTitle(`Очередь для ${interaction.guild.name}`)
                .setColor(client.colors.main);

            const multiple = 15;
            let page = Number(pageQ);

            let end = page * multiple;
            let start = end - multiple;

            let tracks = queue.slice(start, end);

            if (queue.current) embed.addField('Сейчас играет', `\` > \` [${queue.current.title}](${queue.current.uri}) • ${client.functions.convertTime(queue.current.length)}`);

            const length = new Date(player.queue.length);

            if (!tracks.length) embed.setDescription(`Треков ${page > 1 ? 'нет' : 'нет'}.`);
            else {
                embed.setDescription(`\` > \` Общая продолжительность: **${length.getHours()} час. ${length.getMinutes()} мин. ${length.getSeconds()} сек.**\n\` > \`Количество треков: **${player.queue.length}**\n\n` + tracks.map((track, i) => `\` ${start + (++i)} > \` [${track.title}](${track.uri}) • ${client.functions.convertTime(track.length)}`).join('\n'));
            }

            const maxPages = Math.ceil(queue.length / multiple);

            embed.setFooter({ text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}` });


            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30_000 });

            collector.on('collect', async i => {
                if (i.customId === 'pageDown') {
                    if (page <= 0) return i.reply('Достигнута минимальная страница');
                    page--;
                    end = page * multiple;
                    start = end - multiple;
                    tracks = queue.slice(start, end);
                    await i.update({
                        embeds: [embed
                            .setFooter({ text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}` })
                            .setDescription(`\` > \` Общая продолжительность: **${length.getHours()} час. ${length.getMinutes()} мин. ${length.getSeconds()} сек.**\n\` > \` Количество треков: **${player.queue.length}**\n\n` + tracks.map((track, i) => `\` ${start + (++i)} > \` [${track.title}](${track.uri}) • ${client.functions.convertTime(track.length)}`).join('\n'))]
                    });
                    collector.resetTimer();
                } else if (i.customId === 'delete') {
                    interaction.fetchReply();
                    interaction.deleteReply();
                    collector.stop();
                } else if (i.customId === 'pageUp') {
                    if (page >= end) return i.reply('Достигнута максимальная страница');
                    page++;
                    end = page * multiple;
                    start = end - multiple;
                    tracks = queue.slice(start, end);
                    await i.update({
                        embeds: [embed
                            .setFooter({ text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}` })
                            .setDescription(`\` > \` Общая продолжительность: **${length.getHours()} час. ${length.getMinutes()} мин. ${length.getSeconds()} сек.**\n\` > \`Количество треков: **${player.queue.length}**\n\n` + tracks.map((track, i) => `\` ${start + (++i)} > \` [${track.title}](${track.uri}) • ${client.functions.convertTime(track.length)}`).join('\n'))]
                    });
                    collector.resetTimer();
                }
            });
            collector.on('end', () => {page = 0;});

            /*          const filter = i => i.user.id === interaction.user.id && i.interaction.id === fetchedInteraction.id;
                        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 });

                        collector.on('collect', i => {
                            console.log(1);
                            console.log(i.customId);
                            /!*if (i.customId === 'pageDown') {
                                console.log('ilya churka 1');
                                if (page <= start) return i.reply('Достигнута минимальная страница');
                                page--;
                                await i.update({
                                    embeds: [embed
                                        .setFooter({ text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}` })
                                        .setDescription(`\` > \` Общая продолжительность: **${length.getHours()} час. ${length.getMinutes()} мин. ${length.getSeconds()} сек.**\n\` > \` Количество треков: **${player.queue.length}**\n\n` + tracks.map((track, i) => `\` ${start + (++i)} > \` [${track.title}](${track.uri}) • ${client.functions.convertTime(track.length)}`).join('\n'))]
                                });
                            } else if (i.customId === 'delete') {
                                console.log('ilya churka 2');
                                interaction.deleteReply();
                            } else if (i.customId === 'pageUp') {
                                console.log('ilya churka 3');
                                if (page >= end) return i.reply('Достигнута максимальная страница');
                                page++;
                                await i.update({
                                    embeds: [embed
                                        .setFooter({ text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}` })
                                        .setDescription(`\` > \` Общая продолжительность: **${length.getHours()} час. ${length.getMinutes()} мин. ${length.getSeconds()} сек.**\n\` > \`Количество треков: **${player.queue.length}**\n\n` + tracks.map((track, i) => `\` ${start + (++i)} > \` [${track.title}](${track.uri}) • ${client.functions.convertTime(track.length)}`).join('\n'))]
                                });
                            }*!/
                        });

                        collector.on('end', () => { console.log('collector end') })*/
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = QueueCommand;
