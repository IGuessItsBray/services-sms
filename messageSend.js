require("dotenv").config();
const schedule = require("node-schedule");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilloNumber = process.env.TWILIO_NUMBER;
const recNumber = process.env.REC_NUMBER
const client = require("twilio")(accountSid, authToken);


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
      to: recNumber, // Text your number
      from: twilloNumber, // From a valid Twilio number
    })
    .then((message) => console.log(message.body));
});