const MatthewsClient = require('./structures/Client');
const client = new MatthewsClient();

client.start().catch(console.error)

module.exports = client;

process.on('uncaughtException', console.error);
process.on('uncaughtRejection', console.error);
process.on('warning', console.error);