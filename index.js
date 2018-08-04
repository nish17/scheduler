const moment = require("moment");
const data = require("./functions/data/5th-sem.json");
/* var data = require("./functions/data/4th-sem.json");

function workingHours(time) {
  if (time >= 9 && time <= 18) return true;
  else return false;
}

function weekdays(day) {
  if (day === "Saturday" || day === "Sunday") return true;
  else return false;
}
*/
function setTimeZone() {
  const indianTimeZone = moment
    .utc()
    .add(5, "hours")
    .add(30, "minutes");
  return indianTimeZone;
}
/*
function nextLectureIntentHandler() {
  const indianTimeMoment = setTimeZone();
  const currentHour = indianTimeMoment.hour();
  // console.log("currentHour: ", currentHour);
  let next = currentHour + 1;
  // console.log("next: ", next);
  let hourCode = "L" + next;
  // console.log("hourCode", hourCode);
  let day = indianTimeMoment.day();
  // console.log("day: ", day);
  let today = moment().format("dddd");
  // console.log("today:", today);
  // console.log(data[day]);
  if (workingHours(next)) {
    if (weekdays(today)) {
      console.log("Enjoy your weekend Buddy!");
    } else {
      const classs = data[day][today][hourCode];
      if (classs.type === "LAB") {
        console.log("Next you have LAB");
        console.log("For H1 Batch:");
        console.log(
          `${classs.h1.name} will be taken by ${classs.h1.Professor}`
        );
        console.log("For H2 Batch:");
        console.log(
          `${classs.h2.name} will be taken by ${classs.h2.Professor}`
        );
        console.log("For H1 Batch:");
        console.log(
          `${classs.h3.name} will be taken by ${classs.h3.Professor}`
        );
      } else if (classs.type == "Lecture") {
        console.log(
          `Next lecture is ${classs.name} which will be taken by ${
            classs.Professor
          }`
        );
      } else if (classs.type === "Free") {
        console.log("It's your free time");
      }
    }
  } else {
    console.log("Please come back during working college hours");
  }
}

function findLectureIntent(x) {
  const indianTimeMoment = setTimeZone();
  const currentHour = indianTimeMoment.hour();
  let next = currentHour + 1;
  let hourCode = "L" + next;
  let day = indianTimeMoment.day();
  console.log(day);
  let today = moment().format("dddd");
  const t = Object.entries(data[day].today).find(([key, value]) =>
    value.Professor.includes(profName)
  );
  console.log(t);
}

findLectureIntent("Manish Chaturvedi");
// nextLectureIntentHandler();
profName;
//  */

// function isItToday(today) {
//   const indianTimeMoment = setTimeZone();
//   const day = indianTimeMoment.format("dddd");
//   const nextDay = indianTimeMoment.add(1, "days");
//   console.log("nextDay ", nextDay.format("dddd"));
//   console.log(nextDay.format("dddd"));
//   // const tomorrow = moment().calender(null, { nextDay });
//   // console.log(tomorrow);
// }

// if (isItToday("Monday")) {
//   console.log("Its monday");
// } else console.log("its not monday");

// console.log(moment("2018-08-01T09:00:00+05:30").hour());
function timeConvert(t) {
  return `${
    t - 12 >= 0 ? `${t - 12 === 0 ? "12" : `${t - 12}`} PM` : `${t} AM`
  }`;
}
function toArray(moData) {
  // console.log(Object.keys(moData));
  const ownProps = Object.keys(moData);
  var i = ownProps.length;
  var resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
  return resArray;
}
const indianTimeMoment = setTimeZone();
const today = "Monday";
const day = 1;

const result = {
  title: `${today}'s schedule`,
  items: {}
};
const entries = toArray(data[day][today]);
console.log(entries.length);
function displayDaySchedule() {
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
}

displayDaySchedule();
console.log(result.items);
