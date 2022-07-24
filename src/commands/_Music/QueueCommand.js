const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['q', 'й', 'йгугу'],
    public: true,
    description: 'Очередь треков добавленных участниками',

    async execute(client, message, args) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("Активных плееров нет");
    
        const queue = player.queue;
        const embed = new MessageEmbed()
          .setTitle(`Очередь для ${message.guild.name}`)
          .setColor(client.colors.main);
    
        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
    
        const end = page * multiple;
        const start = end - multiple;
    
        const tracks = queue.slice(start, end);
    
        if(queue.current) embed.addField("Сейчас играет", `[${queue.current.title}](${queue.current.uri}) • ${client.utils.format(queue.current.duration)}`);
    
        if(!tracks.length) embed.setDescription(`Треков ${page > 1 ? `Страница ${page}` : "нет"}.`);
        else embed.setDescription(tracks.map((track, i) => `**${start + (++i)}** - [${track.title}](${track.uri}) • ${client.utils.format(track.duration)}`).join("\n"));
    
        const maxPages = Math.ceil(queue.length / multiple);
    
        embed.setFooter({text: `Страница ${page > maxPages ? maxPages : page}/${maxPages}`});
    
        return message.reply({embeds: [embed]});
    }
}