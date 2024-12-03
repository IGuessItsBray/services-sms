require("dotenv").config();
const { SID, TOKEN, FROM, TO } = require('../config.json');
const client = require('twilio')(SID, TOKEN);

module.exports = { sendMessage }

function sendMessage(body, to = TO, from = FROM) {
    client.messages
        .create({ body, to, from })
        .then((message) => console.log(message.body))
        .catch(e => {
            console.error('Something went wrong sending sms', e)
        });
}

