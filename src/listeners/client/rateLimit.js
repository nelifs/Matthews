module.exports = async (client, eventName, d) => {
    await client.logger.warn('Main thread', d)
}