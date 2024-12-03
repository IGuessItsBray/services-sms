require("dotenv").config();
const schedule = require("node-schedule");

const { SID, TOKEN, FROM, TO } = require('./config.json');
const client = require('twilio')(SID, TOKEN);


const job = schedule.scheduleJob("01 * * * * *", function(fireDate) {
  console.log("The answer to life, the universe, and everything!");
  console.log(
    "This job was supposed to run at " +
      fireDate +
      ", but actually ran at " +
      new Date()
  );
  client.messages
    .create({
      body: "Hello from twilio-node",
      to: TO, 
      from: FROM, 
    })
    .then((message) => console.log(message.body));
});
