const { ShardingManager } = require('discord.js');
require("dotenv").config()

const manager = new ShardingManager('./src/index.js', { token: process.env.DISCORD_TOKEN, totalShards: 4, shardList: [2, 3] });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

process.on('uncaughtException', console.error);

void manager.spawn();
