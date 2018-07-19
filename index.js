const moment = require("moment");
var data = require("./functions/newData.json");

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
  const t = Object.entries(data[day].today).find(
    ([key, value]) => value.Professor === x
  );
  console.log(t);
}

findLectureIntent("Manish Chaturvedi");
// nextLectureIntentHandler();
