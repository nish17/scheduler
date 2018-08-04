"use strict";
const {
  dialogflow,
  List,
  Suggestions,
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

function isItToday(today) {
  const indianTimeMoment = setTimeZone();
  const day = indianTimeMoment.format("dddd");
  const nextDay = indianTimeMoment.add("days", 1);
  if (today === day) {
    return "today";
  } else if (today === nextDay.format("dddd")) {
    return "tomorrow";
  } else return `on ${today}`;
}

function isItTomorrow(today) {}

function toArray(moData) {
  // console.log(Object.keys(moData));
  const ownProps = Object.keys(moData);
  var i = ownProps.length;
  var resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
  return resArray;
}

app.intent("findLectureIntent", conv => {
  const day = moment(conv.body.queryResult.parameters["date"][0]).day();
  const profName = conv.body.queryResult.parameters["profName"][0];
  const today = moment(conv.body.queryResult.parameters["date"][0]).format(
    "dddd"
  );

  if (today === "Saturday" || today === "Sunday") {
    conv.close(
      `<speak>Enjoy your weekend buddy! There aren't any lectures of ${profName} on weekends</speak>`
    );
  } else {
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
          } at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${isItToday(
            today
          )}.</speak>`
        );
        break;
      } else {
        if (entries[i][1].Professor === "Lecture" && entries[i][0] === "L17") {
          conv.close(
            `<speak>There is no lecture by ${profName} ${isItToday(
              today
            )}</speak>`
          );
          break;
        }
      }
    }
  }
});

app.intent("nextLectureIntent", conv => {
  const indianTimeMoment = setTimeZone();
  const currentHour = indianTimeMoment.hour();
  const next = currentHour + 1;
  const hourCode = "L" + next;
  const day = indianTimeMoment.day();
  const today = moment().format("dddd");
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
  const hourCode = "L" + currentHour;
  const day = indianTimeMoment.day();
  const today = moment().format("dddd");
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
  // const indianTimeMoment = setTimeZone();
  const hourCode =
    "L" + new Date(conv.body.queryResult.parameters.time).getHours();
  const dayCode = moment(conv.body.queryResult.parameters.date).day();
  const day = moment(conv.body.queryResult.parameters.date).format("dddd");

  const classs = data[dayCode][day][hourCode];
  // console.log(classs);
  conv.close(`<speak>${dayCode}, ${day}, ${hourCode}</speak>`);
  // conv.close(`<speak>${Ltime}: ${hourCode} ${dayCode} ${day}</speak>`);

  // conv.close(
  //   `<speak>${classs.type} ${classs.name} ${classs.Professor}</speak>`
  // );

  /*   if (classs.type === "LAB") {
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
  */
});
function timeConvert(t) {
  return `${
    t - 12 >= 0 ? `${t - 12 === 0 ? "12" : `${t - 12}`} PM` : `${t} AM`
  }`;
}
app.intent("showFullSchedule", conv => {
  const day = moment(conv.body.queryResult.parameters.date).day();
  const today = moment(conv.body.queryResult.parameters.date).format("dddd");
  const entries = toArray(data[day][today]);
  /* You can also try to concatenate all the results into oen string and then display the result */
  if (today === "Saturday" || today === "Sunday") {
    conv.close(`<speak>Enjoy your weekend buddy!</speak>`);
  } else {
    const result = {
      title: `${today}'s schedule`,
      items: {}
    };
    for (const entry of entries) {
      // console.log("entry.length", entry.length);
      const key = entry[0];
      const value = entry[1];
      if (value.type === "Lecture") {
        result.items[value.name] = {
          synonyms: [`${value.name}`],
          title: `${value.name}`,
          description: `At ${timeConvert(parseInt(key.substring(1)))} ${
            value.name
          } by ${value.Professor} `
        };
      } else if (value.type === "LAB") {
        result.items[`${value.h1.name}, ${value.h2.name}, ${value.h3.name}`] = {
          synonyms: [`${value.h1.name} ${value.h2.name} ${value.h3.name}`],
          title: `LAB Session`,
          description:
            `For H1 Batch, At ${timeConvert(parseInt(key.substring(1)))} ${
              value.h1.name
            } by ${value.h1.Professor} ` +
            `For H2 Batch, At ${timeConvert(parseInt(key.substring(1)))} ${
              value.h2.name
            } by ${value.h2.Professor} ` +
            `For h3 Batch, At ${timeConvert(parseInt(key.substring(1)))} ${
              value.h3.name
            } by ${value.h3.Professor} `
        };
      } else {
        //if (value.type === "Free") {}
        result.items[value.type] = {
          synonyms: [`${value.type}`],
          title: `${value.type}`,
          description: `At ${timeConvert(
            parseInt(key.substring(1))
          )}  Its your free time`
        };
      }
    }
    conv.close(`<speak>Here is ${result.title}</speak>`);
    conv.close(new List(result));
  }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

/*     for (let i = 0; i < entries.length; i++) {
      if (entries[i][1].type === "Lecture") {
        const t = parseInt(entries[i][0].substring(1));
        conv.close(`<speak>
          At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${
          entries[i][1].name
        } by ${entries[i][1].Professor}</speak>`);
        // break;
      } else if (entries[i][1].type === "LAB") {
        const t = parseInt(entries[i][0].substring(1));
        conv.close(`<speak>
          For H1 Batch At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${
          entries[i][1].h1.name
        } by ${entries[i][1].h1.Professor}</speak>`);
        conv.close(`<speak>
          For H2 Batch At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${
          entries[i][1].h2.name
        } by ${entries[i][1].h2.Professor}</speak>`);
        conv.close(`<speak>
          For H3 Batch At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${
          entries[i][1].h3.name
        } by ${entries[i][1].h3.Professor}</speak>`);
      } else {
        const t = parseInt(entries[i][0].substring(1));
        conv.close(
          `<speak>At ${
            t - 12 > 0 ? `${t - 12} PM` : `${t} AM`
          } Free Time. </speak>`
        );
      }
    } */

/* List Code Replaced with jaydeep's solution */
/* {
        title: `${today}'s schedule`,
        items: {
          [entries[0][1].name]: {
            synonyms: [`${entries[0][1].name}`],
            title: `${entries[0][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[0][0].substring(1))
            )} ${entries[0][1].name} by ${entries[0][1].Professor} `
          },
          [entries[1][1].name]: {
            synonyms: [`${entries[1][1].name}`],
            title: `${entries[1][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[1][0].substring(1))
            )} ${entries[1][1].name} by ${entries[1][1].Professor} `
          },
          [entries[2][1].name]: {
            synonyms: [`${entries[2][1].name}`],
            title: `${entries[2][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[2][0].substring(1))
            )} ${entries[2][1].name} by ${entries[2][1].Professor} `
          },
          [entries[3][1].name]: {
            synonyms: [`${entries[3][1].name}`],
            title: `${entries[3][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[3][0].substring(1))
            )} ${entries[3][1].name} by ${entries[3][1].Professor} `
          },
          [entries[4][1].name]: {
            synonyms: [`${entries[4][1].name}`],
            title: `${entries[4][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[4][0].substring(1))
            )} ${entries[4][1].name} by ${entries[4][1].Professor} `
          },
          [entries[5][1].name]: {
            synonyms: [`${entries[5][1].name}`],
            title: `${entries[5][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[5][0].substring(1))
            )} ${entries[5][1].name} by ${entries[5][1].Professor} `
          },
          [entries[6][1].name]: {
            synonyms: [`${entries[6][1].name}`],
            title: `${entries[6][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[6][0].substring(1))
            )} ${entries[6][1].name} by ${entries[6][1].Professor} `
          },
          [entries[7][1].name]: {
            synonyms: [`${entries[7][1].name}`],
            title: `${entries[7][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[7][0].substring(1))
            )} ${entries[7][1].name} by ${entries[7][1].Professor} `
          },
          [entries[8][1].name]: {
            synonyms: [`${entries[8][1].name}`],
            title: `${entries[8][1].name}`,
            description: `At ${timeConvert(
              parseInt(entries[8][0].substring(1))
            )} ${entries[8][1].name} by ${entries[8][1].Professor} `
          }
        }
      } */
