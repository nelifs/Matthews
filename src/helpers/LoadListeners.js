const BaseListener = require('../structures/BaseListener');

const path = require('node:path');
const fs = require('node:fs/promises');

module.exports = async function loadListeners(client, dir = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {

        client.logger.send(`Listeners Loader`, `Listener ${file} successfully loaded`)
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) {
            await loadListeners(client, path.join(dir, file));
        }
        if (file.endsWith('.js')) {
            const Listener = require(path.join(filePath, file));
            if (Listener.prototype instanceof BaseListener) {
                const listener = new Listener();
                client.listeners.set(listener.name, listener);
                if(listener.type === 1) {
                    client.manager.on(listener.event, listener.run.bind(listener, client));
                } else {
                    client.on(listener.event, listener.run.bind(listener, client));
                }
                if (listener.ws)
                    client.ws.on(listener.event, listener.run.bind(listener, client));
            }
        }
    }
}
