const BaseListener = require('../../structures/BaseListener')

class ErrorListener extends BaseListener {
    constructor() {
        super('Error', {event: 'error'});
    }

    run(client, d) {
        client.logger.error(d)
    }
}

module.exports = ErrorListener;
