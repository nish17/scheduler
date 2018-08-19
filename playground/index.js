"use strict";
const {
  dialogflow,
  List,
  Suggestions,
  SimpleResponse
} = require("actions-on-google");
// const { randomize, Randomization } = require("randomize");
const functions = require("firebase-functions");
const app = dialogflow(); //.use(randomize);
const moment = require("moment");
var data = undefined;

function requireDateFile(depart) {
  data = require(`./data/${depart}_5th-sem.json`);
}

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

app.intent("findLectureIntent", conv => {
  const day = moment(conv.body.queryResult.parameters["date"][0]).day();
  const profName = conv.body.queryResult.parameters["profName"][0];
  const today = moment(conv.body.queryResult.parameters["date"][0]).format(
    "dddd"
  );
  const indianTimeMoment = setTimeZone();
  if (today === "Saturday" || today === "Sunday") {
    conv.close(
      `<speak>Enjoy your weekend buddy! There aren't any lectures of ${profName} on weekends</speak>`
    );
  } else {
    const entries = toArray(data[day][today]);

    for (let i = 0; i < entries.length; i++) {
      if (
        entries[i][1].type === "Lecture" &&
        entries[i][1].Professor === profName
      ) {
        const t = parseInt(entries[i][0].substring(1));
        conv.close(
          `<speak>Yes there is a lecture by ${profName} of ${
            entries[i][1].name
          } at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} ${isToday(
            today
          )}.</speak>`
        );
        break;
      } else if (entries[i][1].type === "Free" && entries[i][0] === "L17") {
        conv.close(
          `<speak>There is no lecture by ${profName} ${isToday(today)}</speak>`
        );
        break;
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
        conv.close(`<speak>It's your free time buddy.</speak>`);
      }
    }
  } else {
    conv.close(`<speak>Please come back during working college hours</speak>`);
  }
});

// app.intent("findLectureByTime", conv => {
//   // const indianTimeMoment = setTimeZone();
//   const hourCode =
//     "L" + new Date(conv.body.queryResult.parameters.time).getHours();
//   const dayCode = moment(conv.body.queryResult.parameters.date).day();
//   const day = moment(conv.body.queryResult.parameters.date).format("dddd");

//   const classs = data[dayCode][day][hourCode];
//   // console.log(classs);
//   conv.close(`<speak>${dayCode}, ${day}, ${hourCode}</speak>`);
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
});
 */
function timeConvert(t) {
  return `${
    t - 12 >= 0 ? `${t - 12 === 0 ? "12" : `${t - 12}`} PM` : `${t} AM`
  }`;
}
function add1Day(day) {
  return moment(day).add(1, "days");
}

app.intent("New Welcome Intent", conv => {
  const indianTimeMoment = setTimeZone();
  if (conv.user.storage.class !== undefined) {
    requireDateFile(conv.user.storage.class);
    conv.ask(
      new SimpleResponse({
        speech: `Hey, Welcome Back to ${
          conv.user.storage.class
        } department! What can I do for you today?`,
        text: `Hey, Welcome Back ${
          conv.user.storage.class
        } department! What can I do for you today?`
      }),
      new Suggestions([
        `Show ${
          indianTimeMoment.format("dddd") === "Saturday" ||
          indianTimeMoment.format("dddd") === "Sunday"
            ? "Monday"
            : `${indianTimeMoment.format("dddd")}`
        }'s schedule`,
        `Change Department`,
        `next lecture please?`,
        `Whose lecture is it?`,
        `whose last lecture is it?`,
        `first lecture today?`,
        `any lecture of GPP today?`
      ])
    );
  } else {
    conv.ask(
      new SimpleResponse({
        speech:
          "Good Day! Welcome to PDPU's scheduler App. Please select your Department first.",
        text:
          "Good Day! Welcome to PDPU's scheduler App. Please select your Department first."
      }),
      new Suggestions([`Show Department List`])
    );
  }
});
app.intent("ask_with_list", conv => {
  conv.ask(
    new SimpleResponse({
      speech: "Here's Departments list",
      text: "Here's Departments list."
    }),
    new List({
      title: "Please select your department",
      items: {
        ICT_16: {
          synonyms: ["SOT ICT 16", "ICT batch 16", "ICT", "16BIT"],
          title: "ICT-16",
          description: "Information and Communication Technology, Batch'16"
        },
        CE_16: {
          synonyms: ["SOT CE 16", "CE batch 16", "CE", "16BCP"],
          title: "CE-16",
          description: "Computer Science Engineering, Batch'16"
        },
        PE_16: {
          synonyms: ["SOT PE 16", "PE batch 16", "PE", "16BPE"],
          title: "PE-16",
          description: "Petroleum Engineering, Batch'16"
        },
        EE_16: {
          synonyms: ["SOT EE 16", "EE batch 16", "EE", "16BEE"],
          title: "EE-16",
          description: "Electrical Engineering, Batch'16"
        },
        CV_16: {
          synonyms: ["SOT CV 16", "CV batch 16", "CV", "16BCV"],
          title: "CV-16",
          description: "Civil Engineering, Batch'16"
        },
        CH_16: {
          synonyms: ["SOT CH 16", "CH batch 16", "CH", "16BCH"],
          title: "CH-16",
          description: "Chemical Engineering, Batch'16"
        },
        MC_16: {
          synonyms: ["SOT MC 16", "MC batch 16", "MC", "16BMC"],
          title: "MC-16",
          description: "Mechanical Engineering, Batch'16"
        },
        IE_16: {
          synonyms: ["SOT IE 16", "IE batch 16", "IE", "16BIE"],
          title: "IE-16",
          description: "Industrial Engineering, Batch'16"
        }
      }
    }),
    new Suggestions([
      `ICT16`,
      `CE16`,
      `PE16`,
      `EE16`,
      `CH16`,
      `CV16`,
      `MC16`,
      `IE16`
    ])
  );
});

function sayDepartandSuggestions(conv, option) {
  const indianTimeMoment = setTimeZone();
  conv.ask(
    new SimpleResponse({
      speech: `That's great! You have selected ${option} batch.`,
      text: `That's great! You have selected ${option} batch.`
    })
  );
  conv.close(`<speak>Showing results for ${conv.user.storage.class}</speak>`);
  conv.ask(
    new Suggestions([
      `Change Department`,
      `Show ${
        indianTimeMoment.format("dddd") === "Saturday" ||
        indianTimeMoment.format("dddd") === "Sunday"
          ? "Monday"
          : `${indianTimeMoment.format("dddd")}`
      }'s schedule`,
      `next lecture please?`,
      `Whose lecture is it?`,
      `any lecture of GPP today?`,
      `number of lectures of NTD`,
      `number of lectures of SKB`,
      `number of lectures of RJO`
    ])
  );
}

app.intent("ask_with_list_confirmation", conv => {
  // Get the user's selection
  // Compare the user's selections to each of the item's keys
  const option = conv.body.queryResult.parameters.departmentsList;
  // conv.close(`<speak>${option}</speak>`);
  if (!option) {
    conv.ask("You did not select any department</speak>");
  } else if (option === "ICT16") {
    conv.user.storage.class = "ICT16";
    sayDepartandSuggestions(conv, option);
  } else if (option === "CE16") {
    conv.user.storage.class = "CE16";
    sayDepartandSuggestions(conv, option);
  } else if (option === "PE16") {
    conv.user.storage.class = "PE16";
    sayDepartandSuggestions(conv, option);
  } else if (option === "EE16") {
    conv.user.storage.class = "EE16";
    sayDepartandSuggestions(conv, option);
  } else if (option === "CV16") {
    conv.user.storage.class = "CV16";
    sayDepartandSuggestions(conv, option);
  } else if (option === "CH16") {
    conv.user.storage.class = "CH16";
    sayDepartandSuggestions(conv, option);
  } else if (option === "MC16") {
    conv.user.storage.class = "MC16";
    sayDepartandSuggestions(conv, option);
  } else if (option === "IE16") {
    conv.user.storage.class = "IE16";
    sayDepartandSuggestions(conv, option);
  } else {
    conv.ask("<speak>You selected an unknown department</speak>");
  }
  // conv.ask(new Suggestions([`${option}?`, `Change Department`]));
});

app.intent("showFullSchedule", conv => {
  let day = moment(conv.body.queryResult.parameters.date).day();
  let today = moment(conv.body.queryResult.parameters.date).format("dddd");
  // if (!isItToday(today, conv.body.queryResult.intent.displayName)) {
  //   today = add1Day(conv.body.queryResult.parameters.date).format("dddd");
  //   day++;
  // }
  if (today === "Saturday" || today === "Sunday") {
    conv.ask(`<speak>Enjoy your weekend buddy!</speak>`);
    conv.ask(
      new Suggestions([
        "show today's Schedule",
        "Show Tuesday's Schedule",
        "Show Wednesday's Schedule",
        "Show Thursday's Schedule",
        "Show Friday's Schedule"
      ])
    );
  } else {
    const entries = toArray(data[day][today]);
    const result = {
      title: `${today}'s schedule`,
      items: {}
    };
    for (const entry of entries) {
      // console.log("entry.length", entry.length);
      const key = entry[0];
      const value = entry[1];
      if (value.type === "Lecture") {
        result.items[
          `${value.name} at ${timeConvert(parseInt(key.substring(1)))}`
        ] = {
          synonyms: [
            `${value.name} at ${timeConvert(parseInt(key.substring(1)))}`
          ],
          title: `At  ${timeConvert(parseInt(key.substring(1)))}: ${
            value.name
          }`,
          description: `By ${value.Professor}.`
        };
      } else if (value.type === "LAB") {
        result.items[`${value.h1.name}, ${value.h2.name}, ${value.h3.name}`] = {
          synonyms: [`${value.h1.name} ${value.h2.name} ${value.h3.name}`],
          title: `LAB Session from ${timeConvert(
            parseInt(key.substring(1))
          )} to ${timeConvert(parseInt(key.substring(1)) + 2)}`,
          description:
            `For H1: ${value.h1.name} by ${value.h1.Professor}, ` +
            `For H2: ${value.h2.name} by ${value.h2.Professor}, ` +
            `For H3: ${value.h3.name} by ${value.h3.Professor}.`
        };
      } else if (value.type === "Free") {
        result.items[
          `${value.name} at ${timeConvert(parseInt(key.substring(1)))}`
        ] = {
          synonyms: [
            `${value.type} at ${timeConvert(parseInt(key.substring(1)))}`
          ],
          title: `At ${timeConvert(parseInt(key.substring(1)))}: ${value.type}`,
          description: `No lecture at ${timeConvert(
            parseInt(key.substring(1))
          )}`
        };
      }
    }
    conv.close(`<speak>Here is ${result.title}</speak>`);
    conv.close(new List(result));
    conv.ask(
      new Suggestions([
        `next lecture please?`,
        `whose last lecture is it?`,
        `Show Monday's schedule`,
        `first lecture today?`,
        `Whose lecture is it?`
      ])
    );
  }
});

app.intent("getPositionOfLecture", conv => {
  const pos = conv.body.queryResult.parameters.position;
  const day = moment(conv.body.queryResult.parameters.date).day();
  const today = moment(conv.body.queryResult.parameters.date).format("dddd");
  if (today === "Saturday" || today === "Sunday") {
    // conv.close(new Suggestions("Suggestion Chips"));
    conv.ask(
      new Suggestions([
        "first lecture on Monday?",
        "last lecture today?",
        "last lecture today?",
        "first lecture tomorrow?"
      ])
    );
    conv.close(`<speak>Enjoy your weekend buddy!</speak>`);
  } else {
    const entries = toArray(data[day][today]);
    for (const entry of entries) {
      const key = entry[0];
      const value = entry[1];
      if (value.type === "Lecture" && value.position === pos) {
        conv.close(
          new SimpleResponse({
            speech: `${pos} lecture is at ${timeConvert(
              parseInt(key.substring(1))
            )} of ${value.name} by ${value.Professor}`,
            text: `${pos} lecture is at ${timeConvert(
              parseInt(key.substring(1))
            )} of ${value.name} by ${value.Professor}`
          })
        );
        break;
      }
    }
  }
});

app.intent("countLectures", conv => {
  const prof = conv.body.queryResult.parameters.profName;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let day = 1;
  let countLect = 0;
  const result = {
    title: `Lectures of ${prof} in a week`,
    items: {}
  };
  console.log(`Lectures of ${prof}`);
  for (var i = 0; i <= 4; i++) {
    // console.log(days[i]);
    const entries = toArray(data[day][days[i]]);
    day++;
    for (const entry of entries) {
      const key = entry[0];
      const value = entry[1];
      if (value.type === "Lecture" && value.Professor === prof) {
        countLect++;
        const t = parseInt(key.substring(1));
        result.items[
          `At ${timeConvert(parseInt(key.substring(1)))} on ${days[i]}`
        ] = {
          synonyms: [
            `At ${timeConvert(parseInt(key.substring(1)))} on ${days[i]}`
          ],
          title: `At  ${timeConvert(parseInt(key.substring(1)))}`,
          description: `on ${days[i]}.`
        };

        console.log(
          `at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} on ${days[i]}`
        );
      }
    }
  }
  conv.close(`Total ${countLect} Lectures`);
  conv.close(new List(result));
  conv.ask(
    new Suggestions([
      `number of lectures of NTD`,
      `number of lectures of SKB`,
      `number of lectures of GPP`,
      `number of lectures of RJO`,
      `next lecture please?`,
      `Show Monday's schedule`,
      `whose last lecture is it?`,
      `first lecture today?`,
      `Whose lecture is it?`
    ])
  );
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
