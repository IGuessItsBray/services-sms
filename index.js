// External Module Requirements
const schedule = require("node-schedule");

// Internal Module Requirements
const { authorize, listEvents } = require('./modules/calendar')
const { sendMessage } = require('./modules/twilio')
const { sendSMS } = require('./modules/twilloWH')


// The actual stuff that should work as 'prod'
const expressApp = require('./modules/express');

expressApp.post('/grafana/:to', (req, res) => {
    const { message } = req.body;
    const { to } = req.params;
    console.log(`Sending SMS to ${to} with message: ${message}`);
    sendSMS(to, message);
    res.send('OK');
});



 schedule.scheduleJob("01 * 0 * * *", function (fireDate) {
     console.log("This job was supposed to run at " + fireDate + ", but actually ran at " + new Date());
     authorize().then(googleClient => {
         listEvents(googleClient).then(events => {
             sendMessage(
                 'Your Daily Summary,\n' +
                 'Here are the next 10 events on your calendar:\n' +
                 events.join('\n')
            )
         })
     });
 });