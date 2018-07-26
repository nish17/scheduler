"use strict";
const {
  dialogflow,
  List,
  BasicCard,
  Permission
} = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });
const moment = require("moment");
var data = require("./data/5th-sem.json");
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

function toArray(moData) {
  // console.log(Object.keys(moData));
  const ownProps = Object.keys(moData);
  var i = ownProps.length;
  var resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
  return resArray;
}

app.intent("findLectureIntent", conv => {
  // const indianTimeMoment = setTimeZone();
  let day = moment(conv.body.queryResult.parameters["date"][0]).day();
  const profName = conv.body.queryResult.parameters["profName"][0];
  let today = moment(conv.body.queryResult.parameters["date"][0]).format(
    "dddd"
  );
  const entries = toArray(data[day][today]);

  for (let i = 0; i < entries.length; i++) {
    if (
      entries[i][1].type === "Lecture" &&
      entries[i][1].Professor !== undefined &&
      entries[i][1].Professor === profName
    ) {
      const t = parseInt(entries[i][0].substring(1));
      conv.close(
        `<speak>Yes there is a lecture by ${profName} of ${
          entries[i][1].name
        } at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} on ${today}</speak>`
      );
      break;
    } else {
      if (entries[i][1].type === "Lecture" && entries[i][0] === "L17") {
        conv.close(`<speak>There is no lecture by ${profName}</speak>`);
        break;
      }
    }
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
            ` For H1 Batch:` +
            ` ${classs.h1.name} will be taken by ${classs.h1.Professor}` +
            ` For H2 Batch: ` +
            ` ${classs.h2.name} will be taken by ${classs.h2.Professor}` +
            ` For H3 Batch: ` +
            ` ${classs.h3.name} will be taken by ${classs.h3.Professor}</speak>`
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
  if (workingHours(currentHour)) {
    if (weekdays(today)) {
      conv.close(`<speak>Enjoy your weekend Buddy!</speak>`);
    } else {
      const classs = data[day][today][hourCode];
      if (classs.type === "LAB") {
        conv.close(
          `<speak> Right Now you have LAB` +
            ` For H1 Batch:` +
            ` It's ${classs.h1.name} LAB taken by ${classs.h1.Professor}` +
            ` For H2 Batch: ` +
            ` It's ${classs.h2.name} LAB taken by ${classs.h2.Professor}` +
            ` For H3 Batch: ` +
            ` It's ${classs.h3.name} LAB taken by ${
              classs.h3.Professor
            }</speak>`
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

app.intent("findLectureByTime", conv => {
  const indianTimeMoment = setTimeZone();
  const Ltime = moment(conv.body.queryResult.parameters["time"]).hour();
  const dayCode = moment(conv.body.queryResult.parameters["date"]).day();
  const day = moment(conv.body.queryResult.parameters["date"]).format("dddd");
  const hourCode = "L" + Ltime;

  const classs = data[dayCode][day][hourCode];
  if (classs.type === "LAB") {
    conv.close(
      `<speak>On ${day} at ${Ltime} You have LAB` +
        ` For H1 Batch:` +
        ` It's ${classs.h1.name} LAB taken by ${classs.h1.Professor}` +
        ` For H2 Batch: ` +
        ` It's ${classs.h2.name} LAB taken by ${classs.h2.Professor}` +
        ` For H3 Batch: ` +
        ` It's ${classs.h3.name} LAB taken by ${classs.h3.Professor}</speak>`
    );
  } else if (classs.type === "Lecture") {
    conv.close(
      `<speak>On ${day} at ${Ltime} you have lecture of ${
        classs.name
      } taken by ${classs.Professor}</speak>`
    );
  } else if (classs.type === "Free") {
    conv.close(
      `<speak> ${day}- ${dayCode} - ${day} -${hourCode} -${Ltime} Oh at that time I think it will be your free time</speak>`
    );
  }
});

app.intent("Default Welcome Intent", conv => {
  if (!conv.surface.capabilities.has("actions.capability.SCREEN_OUTPUT")) {
    conv.ask(
      "Sorry, try this on a screen device or select the " +
        "phone surface in the simulator."
    );
    return;
  }
  // Create a list
  conv.ask(
    new List({
      title: "Select Department",
      items: {
        // Add the first item to the list
        [SELECTION_KEY_ICT]: {
          synonyms: [
            "In which you are studying? ",
            "May I know you department please?",
            "Department, please?"
          ],
          title: "ICT",
          description: "ICT 2016 Batch"
        },
        // Add the second item to the list
        [SELECTION_KEY_CE]: {
          synonyms: [
            "In which you are studying? ",
            "May I know you department please?",
            "Department, please?"
          ],
          title: "CE",
          description: "CE 2016 batch"
        }
      }
    })
  );
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
