const moment = require("moment");
var data = require("../functions/data/5th-sem.json");
// const data = require("../functions/newData.json");

// /* const indianTimeMoment = moment
//   .utc()
//   .add(5, "hours")
//   .add(30, "minutes");
// const currentHour = indianTimeMoment.hours();
// const currentDay = indianTimeMoment.day();
// console.log(currentDay);
// console.log(currentHour);
//  */
function setTimeZone() {
  const indianTimeZone = moment
    .utc()
    .add(5, "hours")
    .add(30, "minutes");
  return indianTimeZone;
}

// function findLectureIntent(x) {
//   const indianTimeMoment = setTimeZone();
//   // const currentHour = indianTimeMoment.hour();
//   // let next = currentHour + 1;
//   // let hourCode = "L" + next;
//   let day = indianTimeMoment.day();
//   day = 1;
//   console.log(day);
//   let today = moment().format("dddd");
//   today = "Monday";
//   console.log(today);
//   const t = Object.entries(data[day][today]).find(
//     ([key, value]) => value.Professor === x
//   )[0];
//   console.log(t[1]);

//   if (t === undefined) {
//     console.log(`Today there is no lecture by ${x}`);
//   } else {
//     console.log(`Yes at ${t[1] - 12 > 0 ? `${t[1] - 12} PM` : `${t[1]} AM`}`);
//     // conv.close(`<speak>Yes at ${t[1] - 12 > 0 ? `${t[1] - 12} PM` : `${t[1]} AM`}</speak>`);
//   }
// }

// findLectureIntent("Manish Chaturvedi");

// profName = "Santosh Kumar Bharti";

// if (profName.toLowerCase().includes("Santosh Bharti".toLowerCase())) {
//   console.log("true");
// }
// console.log(profName.toLowerCase().includes("Santosh Bharti".toLowerCase()));

let day = moment("2018-07-27T09:00:00+05:30").format("dddd");
console.log(day);
let dayCode = moment("2018-07-27T09:00:00+05:30").day();
console.log(dayCode);
let time = moment("2018-07-27T13:00:00+05:30").hour();
console.log(time);
let hourCode = "L" + time;
console.log(hourCode);

console.log(data[dayCode][day][hourCode]);
