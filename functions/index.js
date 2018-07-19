"use strict";

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const { dialogflow, BasicCard, Permission } = require("actions-on-google");
// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
// { debug: true });

const moment = require("moment");
var data = require("./newData.json");
function workingHours(time) {
  if (time >= 9 && time <= 18) return true;
  else return false;
}
function weekdays(day) {
  if (day === "Saturday" || day === "Sunday") return true;
  else return false;
}
function setTimeZone() {
  const indianTimeZone = moment
    .utc()
    .add(5, "hours")
    .add(30, "minutes");
  return indianTimeZone;
}
// // Define a mapping of fake color strings to basic card objects.
// const colorMap = {
//   "indigo taco": new BasicCard({
//     title: "Indigo Taco",
//     image: {
//       url:
//         "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png",
//       accessibilityText: "Indigo Taco Color"
//     },
//     display: "WHITE"
//   }),
//   "pink unicorn": new BasicCard({
//     title: "Pink Unicorn",
//     image: {
//       url:
//         "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png",
//       accessibilityText: "Pink Unicorn Color"
//     },
//     display: "WHITE"
//   }),
//   "blue grey coffee": new BasicCard({
//     title: "Blue Grey Coffee",
//     image: {
//       url:
//         "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png",
//       accessibilityText: "Blue Grey Coffee Color"
//     },
//     display: "WHITE"
//   })
// };

// Handle the Dialogflow intent named 'Default Welcome Intent'.
// app.intent("Default Welcome Intent", conv => {
//   // Asks the user's permission to know their name, for personalization.
//   conv.ask(
//     new Permission({
//       context: "Hi there, to get to know you better",
//       permissions: "NAME"
//     })
//   );
// });

app.intent("cuurentLectureIntent", conv => {});

app.intent("nextLectureIntent", conv => {
  const indianTimeMoment = setTimeZone();
  const currentHour = indianTimeMoment.hour();
  let next = currentHour + 1;
  let hourCode = "L" + next;
  let day = indianTimeMoment.day();
  let today = moment().format("dddd");
  if (workingHours(next)) {
    if (weekdays(today)) {
      conv.close(`<speak>Enjoy your weekend Buddy!</speak>`);
    } else {
      const classs = data[day][today][hourCode];
      if (classs.type === "LAB") {
        conv.close(
          `<speak> Next you have LAB` +
            `For H1 Batch:` +
            `${classs.h1.name} will be taken by ${classs.h1.Professor}` +
            `For H2 Batch: ` +
            `${classs.h2.name} will be taken by ${classs.h2.Professor}` +
            `For H1 Batch: ` +
            `${classs.h3.name} will be taken by ${classs.h3.Professor}</speak>`
        );
      } else if (classs.type === "Lecture") {
        conv.close(
          `<speak>Next lecture is ${classs.name} which will be taken by ${
            classs.Professor
          }</speak>`
        );
      } else if (classs.type === "Free") {
        conv.close(`<speak>It's your free time</speak>`);
      }
    }
  } else {
    conv.close(
      `<speak>Please come back during working college hours :${t}</speak>`
    );
  }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
// app.intent("actions_intent_PERMISSION", (conv, params, permissionGranted) => {
//   if (!permissionGranted) {
//     // If the user denied our request, go ahead with the conversation.
//     conv.ask(`OK, no worries. What's your favorite color?`);
//   } else {
//     // If the user accepted our request, store their name in
//     // the 'conv.data' object for the duration of the conversation.
//     conv.data.userName = conv.user.name.display;
//     conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
//   }
// });

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
// app.intent("favorite color", (conv, { color }) => {
//   const luckyNumber = color.length;
//   const audioSound =
//     "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
//   if (conv.data.userName) {
//     // If we collected user name previously, address them by name and use SSML
//     // to embed an audio snippet in the response.
//     conv.ask(
//       `<speak>${conv.data.userName}, your lucky number is ` +
//         `${luckyNumber}.<audio src="${audioSound}"></audio>` +
//         `Would you like to hear some fake colors?</speak>`
//     );
//   } else {
//     conv.ask(
//       `<speak>Your lucky number is ${luckyNumber}.` +
//         `<audio src="${audioSound}"></audio>` +
//         `Would you like to hear some fake colors?</speak>`
//     );
//   }
// });

// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
// app.intent("favorite fake color", (conv, { fakeColor }) => {
//   // Present user with the corresponding basic card and end the conversation.
//   conv.close(`Here's the color`, colorMap[fakeColor]);
// });

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
