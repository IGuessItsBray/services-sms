const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilloNumber = process.env.TWILIO_NUMBER;
const recNumber = process.env.REC_NUMBER
const client = require('twilio')(accountSid, authToken);

module.exports = {
    sendSMS: (to, message) => {
        return client.messages.create({
            to,
            from: twilloNumber,
            body: message
        });
    }
}