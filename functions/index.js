"use strict";
const { dialogflow, BasicCard, Permission } = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });
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

app.intent("findLectureIntent", (conv, name) => {
  const indianTimeMoment = setTimeZone();
  let day = indianTimeMoment.day();
  let today = moment().format("dddd");
  const t = Object.entries(data[day][today]).find(
    ([key, value]) => value.Professor === name
  )[0];
  if (t === undefined) {
    return conv.close(`<speak>Today there is no lecture by ${name}</speak>`);
  } else {
    return conv.close(
      `<speak>Yes at ${
        t[1] - 12 > 0 ? `${t[1] - 12} PM` : `${t[1]} AM`
      }</speak>`
    );
  }
});

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
    conv.close(`<speak>Please come back during working college hours</speak>`);
  }
});

app.intent("currentLectureIntent", conv => {
  const indianTimeMoment = setTimeZone();
  const currentHour = indianTimeMoment.hour();
  let hourCode = "L" + currentHour;
  let day = indianTimeMoment.day();
  let today = moment().format("dddd");
  if (workingHours(next)) {
    if (weekdays(today)) {
      conv.close(`<speak>Enjoy your weekend Buddy!</speak>`);
    } else {
      const classs = data[day][today][hourCode];
      if (classs.type === "LAB") {
        conv.close(
          `<speak> Right Now you have LAB` +
            `For H1 Batch:` +
            `It's ${classs.h1.name} LAB taken by ${classs.h1.Professor}` +
            `For H2 Batch: ` +
            `It's ${classs.h2.name} LAB taken by ${classs.h2.Professor}` +
            `For H1 Batch: ` +
            `It's ${classs.h3.name} LAB taken by ${classs.h3.Professor}</speak>`
        );
      } else if (classs.type === "Lecture") {
        conv.close(
          `<speak>Current lecture is ${classs.name} taken by ${
            classs.Professor
          }</speak>`
        );
      } else if (classs.type === "Free") {
        conv.close(`<speak>It's your free time</speak>`);
      }
    }
  } else {
    conv.close(`<speak>Please come back during working college hours</speak>`);
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
