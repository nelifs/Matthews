const BaseListener = require('../../structures/BaseListener')

class ApiResponseListener extends BaseListener {
    constructor() {
        super('ApiResponse', {event: 'apiResponse'});
    }

    run(client, d) {
        //client.logger.send(d)
    }
}

module.exports = ApiResponseListener;