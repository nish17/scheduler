const moment = require("moment");

const indianTimeMoment = moment
  .utc()
  .add(5, "hours")
  .add(30, "minutes");
const currentHour = indianTimeMoment.hours();
const currentDay = indianTimeMoment.day();
console.log(currentDay);
console.log(currentHour);
