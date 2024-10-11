// External Module Requirements
const schedule = require("node-schedule");

// Internal Module Requirements
const { authorize, listEvents } = require('./modules/calendar')
const { sendMessage } = require('./modules/twilio')

// Test getting events array
// authorize().then(googleClient => {
//     listEvents(googleClient).then(events => {
//         console.log(events)
//     })
// });

// Test sending a message
// sendMesage('Hello, world!');

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

// The actual stuff that should work as 'prod'
// schedule.scheduleJob("01 * * * * *", function (fireDate) {
//     console.log("This job was supposed to run at " + fireDate + ", but actually ran at " + new Date());
//     authorize().then(googleClient => {
//         listEvents(googleClient).then(events => {
//             sendMessage(
//                 'Your Daily Summary,\n' +
//                 'Here are the next 10 events on your calendar:\n' +
//                 events.join('\n')
//             )
//         })
//     });
// });