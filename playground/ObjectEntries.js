const data = require("../functions/data/5th-sem.json");
const moment = require("moment");
// const mooData = data[1]["Monday"];

// function toArray(moData) {
//   const ownProps = Object.keys(moData);
//   var i = ownProps.length;
//   resArray = new Array(i);
//   while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
//   return resArray;
// }
// const entries = toArray(mooData);
// const profName = "Santosh Kumar Bharti";

// for (let i = 0; i < entries.length; i++) {
//   // console.log(entries[i][1].Professor.toLowerCase());
//   if (
//     entries[i][1].Professor != undefined &&
//     entries[i][1].Professor === profName
//   ) {
//     const t = parseInt(entries[i][0].substring(1));
//     console.log(`Yes at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`}`);
//     break;
//   } else {
//     if (entries[i][0] == "L17") {
//       console.log("not found");
//       break;
//     }
//   }
// }

const hourCode = "L" + moment("2018-08-02T09:00:00+05:30").hour();
const dayCode = moment("2018-08-03T12:00:00+05:30").day();
const day = moment("2018-08-03T12:00:00+05:30").format("dddd");
// const hourCode = "L" + Ltime;

const classs = data[dayCode][day][hourCode];
// console.log(dayCode);
// console.log(day);
// console.log(hourCode);
// console.log(classs);
// console.log(moment("2018-08-03T12:00:00+05:30", moment.ISO_8601));

var myDate = "L" + new Date("2018-08-02T09:00:00+05:30").getHours();

// var minutes = myDate.getMinutes();
// var hours = myDate.getHours();
// console.log(minutes);
console.log(myDate);
