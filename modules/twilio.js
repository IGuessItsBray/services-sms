require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilloNumber = process.env.TWILIO_NUMBER;
const recNumber = process.env.REC_NUMBER

module.exports = { sendMessage }

function sendMessage(body, to = recNumber, from = twilloNumber) {
    const client = require("twilio")(accountSid, authToken);
    client.messages
        .create({ body, to, from })
        .then((message) => console.log(message.body))
        .catch(e => {
            console.error('Something went wrong sending sms', e)
        });
}

