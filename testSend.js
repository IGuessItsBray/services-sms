// External Module Requirements
const schedule = require("node-schedule");

// Internal Module Requirements
const { authorize, listEvents } = require("./modules/calendar");
const { sendMessage } = require("./modules/twilio");

// Test everything without schedule
authorize().then(googleClient => {
    listEvents(googleClient).then(events => {
        console.log(events);
        sendMessage(
            'Your Daily Summary,\n' +
            'Here are the next 10 events on your calendar:\n' +
            events.join('\n')
        )
    })
});