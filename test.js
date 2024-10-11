require("dotenv").config();
const schedule = require("node-schedule");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilloNumber = process.env.TWILIO_NUMBER;
const recNumber = process.env.REC_NUMBER;
const client = require("twilio")(accountSid, authToken);

const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const job = schedule.scheduleJob("01 * * * * *", function (fireDate) {
  // If modifying these scopes, delete token.json.
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = path.join(process.cwd(), "token.json");
  const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async function listEvents(auth) {
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId:
        "0fec94d197a5fb0bada79333bd60361981fe5ae7f27388b561fefcb195e0ef98@group.calendar.google.com",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log("No upcoming events found.");
      return;
    }
    console.log("Upcoming 10 events:");
    return events
      .map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        //console.log(`${start} - ${event.summary}`);
      })
      .join("\n");
  }
  
  const eventString = authorize().then(listEvents);
  console.log(eventString);
  authorize().then(listEvents).catch(console.error);
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
