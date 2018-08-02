const data = require("../functions/data/5th-sem.json");
const moment = require("moment");
const mooData = data[1]["Monday"];

function toArray(moData) {
  const ownProps = Object.keys(moData);
  var i = ownProps.length;
  resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
  return resArray;
}
const entries = toArray(mooData);
const profName = "Santosh Kumar Bharti";

//console.log(entries[1][0], entries[1][1]);

for (let i = 0; i < entries.length; i++) {
  // console.log(entries[i][1].Professor.toLowerCase());
  if (entries[i][1].type === "Lecture") {
    const t = parseInt(entries[i][0].substring(1));
    console.log(
      `At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${entries[i][1].name} by ${
        entries[i][1].Professor
      }`
    );
    // break;
  } else if (entries[i][1].type === "LAB") {
    const t = parseInt(entries[i][0].substring(1));
    console.log(
      `For H1 Batch At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${
        entries[i][1].h1.name
      } by ${entries[i][1].h1.Professor}`
    );
    console.log(
      `For H2 Batch At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${
        entries[i][1].h2.name
      } by ${entries[i][1].h2.Professor}`
    );
    console.log(
      `For H3 Batch At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${
        entries[i][1].h3.name
      } by ${entries[i][1].h3.Professor}`
    );
  } else {
    const t = parseInt(entries[i][0].substring(1));
    console.log(`At ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} Free Time`);
  }
}

// const hourCode = "L" + moment("2018-08-02T09:00:00+05:30").hour();
// const dayCode = moment("2018-08-03T12:00:00+05:30").day();
// const day = moment("2018-08-03T12:00:00+05:30").format("dddd");
// // const hourCode = "L" + Ltime;

// const classs = data[dayCode][day][hourCode];
// // console.log(dayCode);
// // console.log(day);
// // console.log(hourCode);
// // console.log(classs);
// // console.log(moment("2018-08-03T12:00:00+05:30", moment.ISO_8601));

// var myDate = "L" + new Date("2018-08-02T09:00:00+05:30").getHours();

// // var minutes = myDate.getMinutes();
// // var hours = myDate.getHours();
// // console.log(minutes);
// console.log(myDate);
