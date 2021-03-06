"use strict";
const moment = require("moment");
const data = require(`../functions/data/ICT16.json`);

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
function isItToday(today, intentName) {
  const indianTimeMoment = setTimeZone();
  const day = indianTimeMoment.format("dddd");
  const nextDay = indianTimeMoment.add(1, "days").format("dddd");
  if (intentName === "showFullSchedule" && today === day) {
    return true;
  } else return false;
}
function isToday(today) {
  const indianTimeMoment = setTimeZone();
  const day = indianTimeMoment.format("dddd");
  const nextDay = indianTimeMoment.add(1, "days").format("dddd");
  if (today === day) {
    return "today";
  } else if (today === nextDay) {
    return "tomorrow";
  } else return `on ${today}`;
}

function toArray(moData) {
  // console.log(Object.keys(moData));
  const ownProps = Object.keys(moData);
  var i = ownProps.length;
  var resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
  return resArray;
}

function timeConvert(t) {
  return `${
    t - 12 >= 0 ? `${t - 12 === 0 ? "12" : `${t - 12}`} PM` : `${t} AM`
  }`;
}

function add1Day(day) {
  return moment(day).add(1, "days");
}

const entries = toArray(data[4]["Thursday"]);
const result = {
  title: `Wednesday's schedule`,
  items: {}
};
function getLabDescription(obj) {
  var finalString = ``;
  let list_of_batches = getListItems(obj);
  for (let i = 0; i < list_of_batches.items.length; i++) {
    finalString += `For ${list_of_batches.items[i].toUpperCase()}: ${
      list_of_batches.labs[i].name
    } by ${list_of_batches.labs[i].Professor} `;
  }
  return finalString;
}

function getListItems(obj) {
  let items = Object.keys(obj);
  let labs = [];
  items.shift();
  Object.keys(obj).forEach(data => {
    if (obj[data] !== "LAB") labs.push(obj[data]);
  });
  // console.log(items);
  // console.log(labs);
  return { items, labs };
}
// Object.value(key);
// console.log(Object.entries(data[5]["Friday"]));
let x = 0;
let lab_timings = [];
for (const entry of entries) {
  // console.log("entries:" + entry[1]);
  const key = entry[0];
  const value = entry[1];
  lab_timings.push(key);
  console.log(lab_timings);
  if (value.type === "LAB") {
    // x = key.substring(1);
    x = key;
  }
}
console.log(parseInt(x.substring(1)));
// lab_timings.find((x)=>{
//   if(x === lab_timings)
// });
// console.log(`${Object.values(value)} , ${Object.values(value)}`);
// if (value.type === "Lecture") {
//   result.items[
//     `${value.name} at ${timeConvert(parseInt(key.substring(1)))}`
//   ] = {
//     synonyms: [`${value.name} at ${timeConvert(parseInt(key.substring(1)))}`],
//     title: `At  ${timeConvert(parseInt(key.substring(1)))}: ${value.name}`,
//     description: `By ${value.Professor}.`
//   };
// } else if (value.type === "LAB") {
//   console.log("=>" + typeof getLabDescription(value));
//   result.items[
//     // `a`
//     `${getListItems(value)}`
//   ] = {
//     synonyms: [
//       `${
//         value[data[6].batches[0]] === undefined
//           ? ""
//           : value[data[6].batches[0]].name
//       } ${
//         value[data[6].batches[1]] === undefined
//           ? ""
//           : value[data[6].batches[1]].name
//       }${
//         value[data[6].batches[2]] === undefined
//           ? ""
//           : value[data[6].batches[2]].name
//       }`
//     ],
//     title: `LAB Session from ${timeConvert(
//       parseInt(key.substring(1))
//     )} to ${timeConvert(parseInt(key.substring(1)) + 2)}`,
//     description: function() {
//       return "" + getLabDescription(value);
//     }
//   };
// } else if (value.type === "Free") {
//   result.items[
//     `${value.name} at ${timeConvert(parseInt(key.substring(1)))}`
//   ] = {
//     synonyms: [`${value.type} at ${timeConvert(parseInt(key.substring(1)))}`],
//     title: `At ${timeConvert(parseInt(key.substring(1)))}: ${value.type}`,
//     description: `No lecture at ${timeConvert(parseInt(key.substring(1)))}`
//   };
// }
// }
// console.log("Result.items = " + JSON.stringify(result));
// for (const key in result) {
// console.log(`typeOf: ${typeof key}, value of key: ${key}`);
// }
