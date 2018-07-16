const moment = require("moment");
var data = require("./newData.json");
// console.log(currentHour);
// const newdata = JSON.parse(data);
// console.log(data[0]);
// console.log(day);

function nextLectureIntentHandler() {
  const currentHour = new Date().getHours();
  let next = currentHour + 1;
  // next = 10;
  let hourCode = "L" + next;
  let day = new Date().getDay();
  // day = 1;
  let today = moment().format("dddd");
  // today = "Monday";
  if (next >= 9 && next <= 18) {
    if (today === "Sunday" || today === "Saturday") {
      // console.log(data[day][today]);
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
  const searchTerm = x;
  data.filter(data => {
    return data;
  });
}

nextLectureIntentHandler();
