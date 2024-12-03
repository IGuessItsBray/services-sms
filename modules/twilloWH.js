const { SID, TOKEN, FROM } = require('../config.json');
const client = require('twilio')(SID, TOKEN);

module.exports = {
    sendSMS: (to, message) => {
        return client.messages.create({
            to,
            from: FROM,
            body: message
        });
    }
}