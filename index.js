// External Module Requirements
const schedule = require("node-schedule");

// Internal Module Requirements
const { authorize, listEvents } = require('./modules/calendar')
const { sendMessage } = require('./modules/twilio')


// The actual stuff that should work as 'prod'
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Received Webhook:', req.body);
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Webhook receiver listening on port ${PORT}`);
});

 schedule.scheduleJob("01 * * * * *", function (fireDate) {
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