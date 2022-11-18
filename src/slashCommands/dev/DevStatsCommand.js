const { MessageEmbed, version } = require('discord.js');
const BaseCommand = require('../../structures/BaseSlashCommand.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const pretty = require('prettysize');
const os = require('os');
const si = require('systeminformation');

class StatsCommand extends BaseCommand {
    constructor() {
        super('dev-stats', {
            data: new SlashCommandBuilder()
                .setName('dev-stats')
                .setDescription('Статистика бота')
                .addBooleanOption(option =>
                    option.setName('ephemeral')
                        .setDescription('???')
                        .setRequired(false))
        });
    }

    async run(client, interaction) {
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
        interaction.deferReply({ ephemeral: ephemeral });
        let voiceConnections = 0;
        client.guilds.cache.forEach(g => {if (g.me.voice.channelId !== null) voiceConnections++;});

        const disk = await si.fsSize();
        const cpu = await si.cpu();
        const currentLoad = await si.currentLoad();
        const net = await si.networkStats();

        let utSec = os.uptime();
        let utMin = utSec/60;
        let utHour = utMin/60;
        let utDay = utHour/24;

        utSec = Math.floor(utSec);
        utMin = Math.floor(utMin);
        utHour = Math.floor(utHour);
        utDay = Math.floor(utDay);

        utHour = utHour%60;
        utMin = utMin%60;
        utSec = utSec%60;
        utDay = utDay%60;

        const embed = new MessageEmbed()
            .setTitle('Статистика')
            .setThumbnail(client.user.avatarURL({ format: 'png' }))
            .addFields([
                {
                    name: 'Основная', value: `
Запущен **<t:${~~(client.readyAt / 1000)}:R>**
Голосовых соединений: **${voiceConnections}**
Серверов: **${client.guilds.cache.size}**
Пользователей: **${client.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0)}**
Каналов: **${client.channels.cache.size}**
Эмодзи: **${client.emojis.cache.size}**
               `
                },
                {
                    name: 'Сервер', value: `
ОС: **${os.version()}**
Архитектура: **${os.arch()}**
PID: **${process.pid}**
Диск: **${pretty(disk[0].used)}/${pretty(disk[0].size)}**
Ап-тайм: 
\` > \` **${utDay} день(ей)** 
\` > \` **${utHour} час(ов)** 
\` > \` **${utMin} минут(а)** 
\` > \` **${utSec} секунд(а)**
            `
                },
                {
                    name: 'Процессор', value: `
\` > \` **${cpu.manufacturer + ' ' + cpu.brand}**
\` > \` Ядер: **${cpu.cores / 2}**
\` > \` Нагрузка: **${~~currentLoad.currentLoad}%**
            `
                },
                {
                    name: 'Сеть', value: `
\` > \` Пинг: **${net[0].ms}ms**
\` > \` Входящая: **${pretty(net[0].tx_sec)}**
\` > \` Выходящая: **${pretty(net[0].rx_sec)}**

\` > \` Всего входящая: **${pretty(net[0].tx_bytes)}**
\` > \` Всего выходящая: **${pretty(net[0].rx_bytes)}**
            `
                },
                {
                    name: 'Память', value: `
\` > \` Используется: **${pretty(process.memoryUsage().rss)}**
\` > \` Всего: **${pretty(os.totalmem())}**
            `
                },
                {
                    name: 'Задержка API', value: `
\` > \` Сейчас: **${client.ws.ping}ms**
\` > \` 5 мин: **${client.ping5m}ms**
\` > \` 15 мин: **${client.ping15m}ms**
\` > \` 1 день: **${client.ping1d}ms**
            `, inline: true
                },
                {
                    name: 'Обработано команд', value: `
\` > \` Сейчас: **${client.handledCommands}**
\` > \` 5 мин: **${client.handledCommands5m}**
\` > \` 15 мин: **${client.handledCommands15m}**
\` > \` 1 день: **${client.handledCommands1d}**
            `, inline: true
                }, /*{
                    name: 'Шарды', value: `
Кол-во шардов: ${client.shard.count}
${pingStr}
                    `
                }*/])
            .setFooter({ text: `${client.users.cache.get(process.env.OWNERID).username} Все права замурлыканы` })
            .setColor(client.colors.main);
        await interaction.editReply({ embeds: [embed], ephemeral: ephemeral });
    }
}

module.exports = StatsCommand;
