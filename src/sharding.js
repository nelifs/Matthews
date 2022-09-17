const {ShardingManager} = require('discord.js');

const manager = new ShardingManager('./src/index.js', {token: process.env.CLIENTTOKEN, totalShards: 30});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

void manager.spawn();
