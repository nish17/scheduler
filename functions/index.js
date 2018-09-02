"use strict";
const {
  dialogflow,
  List,
  Suggestions,
  Confirmation,
  SimpleResponse
} = require("actions-on-google");
// const { randomize, Randomization } = require("randomize");
const functions = require("firebase-functions");
const app = dialogflow(); //.use(randomize);
const moment = require("moment");
var data = undefined;

function requireDataFile(conv) {
  if (conv.user.storage.class)
    data = require(`./data/${conv.user.storage.class}.json`);
  if (data === undefined) {
    conv.ask(
      new SimpleResponse({
        speech: "Please select your Department first. ",
        text: "Please select your Department first. "
      }),
      new Suggestions([`Show Department List`])
    );
  }
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

function timeConvert(t) {
  return `${
    t - 12 >= 0 ? `${t - 12 === 0 ? "12" : `${t - 12}`} PM` : `${t} AM`
  }`;
}

function add1Day(day) {
  return moment(day).add(1, "days");
}

app.intent("findLectureIntent", conv => {
  requireDataFile(conv);
  // conv.user.storage.class = "ICT16";
  if (data === undefined) {
    data = require("./data/ICT16.json");
    conv.user.storage.class = "ICT16";
  }
  data = require(`./data/${conv.user.storage.class}.json`);
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
    conv.ask(
      new Suggestions([
        `next lecture please?`,
        `any lecture of GPP today?`,
        `any lecture of NTD today?`,
        `any lecture of SKB today?`,
        `Whose lecture is it?`,
        `whose last lecture is it?`
      ])
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
        conv.ask(
          new Suggestions([
            `next lecture please?`,
            `any lecture of GPP today?`,
            `any lecture of NTD today?`,
            `any lecture of SKB today?`,
            `Whose lecture is it?`,
            `whose last lecture is it?`
          ])
        );
        break;
      } else if (entries[i][1].type === "Free" && entries[i][0] === "L17") {
        conv.close(
          `<speak>There is no lecture by ${profName} ${isToday(today)}</speak>`
        );
        conv.ask(
          new Suggestions([
            `next lecture please?`,
            `any lecture of GPP today?`,
            `any lecture of NTD today?`,
            `any lecture of SKB today?`,
            `Whose lecture is it?`,
            `whose last lecture is it?`
          ])
        );
        break;
      }
    }
  }
});

app.intent("nextLectureIntent", conv => {
  requireDataFile(conv);
  if (data === undefined) {
    data = require("./data/ICT16.json");
    conv.user.storage.class = "ICT16";
  }
  const indianTimeMoment = setTimeZone();
  const currentHour = indianTimeMoment.hour();
  const next = currentHour + 1;
  const hourCode = "L" + next;
  const day = indianTimeMoment.day();
  const today = moment().format("dddd");
  if (workingHours(next)) {
    if (weekdays(today)) {
      conv.close(`<speak>Enjoy your weekend Buddy!</speak>`);
      conv.ask(
        new Suggestions([
          `next lecture please?`,
          `Change Department`,
          `any lecture of GPP today?`,
          `Whose lecture is it?`,
          `whose last lecture is it?`,
          `first lecture today?`
        ])
      );
    } else {
      const classs = data[day][today][hourCode];
      if (classs.type === "LAB") {
        conv.close(
          `<speak> Next you have LAB` +
            ` For ${data[6].batches[0].toUpperCase()} Batch:` +
            ` ${classs[data[6].batches[0]].name} will be taken by ${
              classs[data[6].batches[0]].Professor
            }` +
            ` For ${data[6].batches[1].toUpperCase()} Batch: ` +
            ` ${classs[data[6].batches[1]].name} will be taken by ${
              classs[data[6].batches[1]].Professor
            }` +
            ` For ${data[6].batches[2].toUpperCase()} Batch: ` +
            ` ${classs[data[6].batches[2]].name} will be taken by ${
              classs[data[6].batches[2]].Professor
            }</speak>`
        );
        conv.ask(
          new Suggestions([
            `next lecture please?`,
            `first lecture today?`,
            `Change Department`,
            `any lecture of GPP today?`,
            `Whose lecture is it?`,
            `whose last lecture is it?`
          ])
        );
      } else if (classs.type === "Lecture") {
        conv.close(
          `<speak>Next lecture is ${classs.name} which will be taken by ${
            classs.Professor
          }</speak>`
        );
        conv.ask(
          new Suggestions([
            `whose last lecture is it?`,
            `next lecture please?`,
            `Change Department`,
            `any lecture of GPP today?`,
            `Whose lecture is it?`,
            `first lecture today?`
          ])
        );
      } else if (classs.type === "Free") {
        conv.close(`<speak>It's your free time</speak>`);
        conv.ask(
          new Suggestions([
            `next lecture please?`,
            `Change Department`,
            `any lecture of GPP today?`,
            `Whose lecture is it?`,
            `whose last lecture is it?`,
            `first lecture today?`
          ])
        );
      }
    }
  } else {
    conv.close(`<speak>Please come back during working college hours</speak>`);
    conv.ask(
      new Suggestions([
        `next lecture please?`,
        `Change Department`,
        `any lecture of GPP today?`,
        `Whose lecture is it?`,
        `whose last lecture is it?`,
        `first lecture today?`
      ])
    );
  }
});

app.intent("currentLectureIntent", conv => {
  requireDataFile(conv);
  if (data === undefined) {
    data = require("./data/ICT16.json");
    conv.user.storage.class = "ICT16";
  }
  const indianTimeMoment = setTimeZone();
  const currentHour = indianTimeMoment.hour();
  const hourCode = "L" + currentHour;
  const day = indianTimeMoment.day();
  const today = moment().format("dddd");
  if (data === undefined) {
    conv.ask(
      `<speak>Please select your department first.</speak>`,
      new Suggestions([`Show Department list`])
    );
  } else {
    if (workingHours(currentHour)) {
      if (weekdays(today)) {
        conv.close(`<speak>Enjoy your weekend Buddy!</speak>`);
      } else {
        const classs = data[day][today][hourCode];
        if (classs.type === "LAB") {
          conv.close(
            `<speak> Right Now you have LAB` +
              ` For ${data[6].batches[0].toUpperCase()} Batch:` +
              ` It's ${classs[data[6].batches[0]].name} LAB taken by ${
                classs[data[6].batches[0]].Professor
              }` +
              ` For ${data[6].batches[1].toUpperCase()} Batch: ` +
              ` It's ${classs[data[6].batches[1]].name} LAB taken by ${
                classs[data[6].batches[1]].Professor
              }` +
              ` For ${data[6].batches[2].toUpperCase()} Batch: ` +
              ` It's ${classs[data[6].batches[2]].name} LAB taken by ${
                classs[data[6].batches[2]].Professor
              }</speak>`
          );
          conv.ask(
            new Suggestions([
              `next lecture please?`,
              `Change Department`,
              `first lecture today?`,
              `any lecture of GPP today?`,
              `Whose lecture is it?`,
              `whose last lecture is it?`
            ])
          );
        } else if (classs.type === "Lecture") {
          conv.close(
            `<speak>Current lecture is ${classs.name} taken by ${
              classs.Professor
            }</speak>`
          );
          conv.ask(
            new Suggestions([
              `whose last lecture is it?`,
              `next lecture please?`,
              `Change Department`,
              `any lecture of GPP today?`,
              `Whose lecture is it?`,
              `first lecture today?`
            ])
          );
        } else if (classs.type === "Free") {
          conv.close(`<speak>It's your free time buddy.</speak>`);
          conv.ask(
            new Suggestions([
              `any lecture of GPP today?`,
              `next lecture please?`,
              `Change Department`,
              `Whose lecture is it?`,
              `whose last lecture is it?`,
              `first lecture today?`
            ])
          );
        }
      }
    } else {
      conv.close(
        `<speak>Please come back during working college hours.</speak>`
      );
      conv.ask(
        new Suggestions([
          `next lecture please?`,
          `Change Department`,
          `any lecture of GPP today?`,
          `Whose lecture is it?`,
          `whose last lecture is it?`,
          `first lecture today?`
        ])
      );
    }
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

app.intent("New Welcome Intent", conv => {
  const indianTimeMoment = setTimeZone();
  if (conv.user.storage.class !== undefined) {
    requireDataFile(conv);
    conv.ask(
      new SimpleResponse({
        speech: `Hey, Welcome Back to ${
          conv.user.storage.class
        } department! What can I do for you today?`,
        text: `Hey, Welcome Back to ${
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
          "Good Day! Welcome to PDPU's scheduler App. By Default it will show results for ICT16 department.",
        text:
          "Good Day! Welcome to PDPU's scheduler App. By Default it will show results for ICT16 department."
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
          synonyms: ["SOT ICT 16", "ICT batch 16", "16BIT"],
          title: "ICT-16",
          description: "Information and Communication Technology, Batch'16"
        },
        ICT_17: {
          synonyms: ["SOT ICT 17", "ICT batch 17", "17BIT"],
          title: "ICT-17",
          description: "Information and Communication Technology, Batch'17"
        },
        CE_16: {
          synonyms: ["SOT CE 16", "CE batch 16", "16BCP"],
          title: "CE-16",
          description: "Computer Science Engineering, Batch'16"
        },
        CE_17: {
          synonyms: ["SOT CE 17", "CE batch 17", "17BCP"],
          title: "CE-17",
          description: "Computer Science Engineering, Batch'17"
        },
        // PE_16: {
        //   synonyms: ["SOT PE 16", "PE batch 16", "16BPE"],
        //   title: "PE-16",
        //   description: "Petroleum Engineering, Batch'16"
        // },
        EE_16: {
          synonyms: ["SOT EE 16", "EE batch 16", "16BEE"],
          title: "EE-16",
          description: "Electrical Engineering, Batch'16"
        },
        CV_16: {
          synonyms: ["SOT CV 16", "CV batch 16", "16BCV"],
          title: "CV-16",
          description: "Civil Engineering, Batch'16"
        },
        CH_16: {
          synonyms: ["SOT CH 16", "CH batch 16", "16BCH"],
          title: "CH-16",
          description: "Chemical Engineering, Batch'16"
        },
        MC_17: {
          synonyms: ["SOT ME 16", "ME batch 16", "16BME"],
          title: "ME-16",
          description: "Mechanical Engineering, Batch'16"
        }
        // IE_16: {
        //   synonyms: ["SOT IE 16", "IE batch 16", "16BIE"],
        //   title: "IE-16",
        //   description: "Industrial Engineering, Batch'16"
        // }
      }
    }),
    new Suggestions([
      `ICT16`,
      `ICT17`,
      `CE16`,
      `CE17`,
      `EE16`,
      `CH16`,
      `ME16`,
      `CV16`
    ])
  );
});

function sayDepartandSuggestions(conv, option) {
  const indianTimeMoment = setTimeZone();
  if (option) {
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
  } else {
    conv.ask(
      new SimpleResponse({
        speech: `This app is still under development. ${option} department will be added soon.`,
        text: `This app is still under development. ${option} department will be added soon :)`
      }),
      new Suggestions([`Change Department`])
    );
  }
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
  } else if (option === "ICT17") {
    conv.user.storage.class = "ICT17";
    sayDepartandSuggestions(conv, option);
  } else if (option === "CE17") {
    conv.user.storage.class = "CE17";
    sayDepartandSuggestions(conv, option);
  } else if (option === "ME16") {
    conv.user.storage.class = "ME16";
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
  }
  //  else if (option === "IE16") {
  //   // conv.user.storage.class = "IE16";
  //   sayDepartandSuggestions(conv, option);
  // }
  else {
    conv.ask(
      "<speak>You selected an unknown department. Please try again</speak>"
    );
    conv.ask(new Suggestions([`Show Department List`]));
  }
  // conv.ask(new Suggestions([`${option}?`, `Change Department`]));
});

function getLabDescription(obj) {
  let finalString = "";
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
  return { items, labs };
}

app.intent("showFullSchedule", conv => {
  requireDataFile(conv);
  if (data === undefined) {
    data = require("./data/ICT16.json");
    conv.user.storage.class = "ICT16";
  }
  let day = moment(conv.body.queryResult.parameters.date).day();
  let today = moment(conv.body.queryResult.parameters.date).format("dddd");
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
      title: `${today}'s schedule of ${conv.user.storage.class}`,
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
        const details = getLabDescription(value);
        const keysInResult = getListItems(value);
        result.items[(keysInResult.labs, keysInResult.items)] = {
          synonyms: [
            `${
              value[data[6].batches[0]] === undefined
                ? ""
                : value[data[6].batches[0]].name
            },${
              value[data[6].batches[1]] === undefined
                ? ""
                : value[data[6].batches[1]].name
            },${
              value[data[6].batches[2]] === undefined
                ? ""
                : value[data[6].batches[2]].name
            }`
          ],
          title: `LAB Session from ${timeConvert(
            parseInt(key.substring(1))
          )} to ${timeConvert(parseInt(key.substring(1)) + 2)}`,
          description: details
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
  requireDataFile(conv);
  if (data === undefined) {
    data = require("./data/ICT16.json");
    conv.user.storage.class = "ICT16";
  }
  const pos = conv.body.queryResult.parameters.position;
  const day = moment(conv.body.queryResult.parameters.date).day();
  const today = moment(conv.body.queryResult.parameters.date).format("dddd");
  if (today === "Saturday" || today === "Sunday") {
    conv.close(`<speak>Enjoy your weekend buddy!</speak>`);
    conv.ask(
      new Suggestions([
        "first lecture on Monday?",
        "last lecture today?",
        "first lecture tomorrow?"
      ])
    );
  } else {
    const entries = toArray(data[day][today]);
    for (const entry of entries) {
      const key = entry[0];
      const value = entry[1];
      if (value.type === "Lecture" && value.position === pos) {
        conv.ask(
          new SimpleResponse({
            speech: `${pos} lecture is at ${timeConvert(
              parseInt(key.substring(1))
            )} of ${value.name} by ${value.Professor}`,
            text: `${pos} lecture is at ${timeConvert(
              parseInt(key.substring(1))
            )} of ${value.name} by ${value.Professor}`
          }),
          new Suggestions([
            `any lecture of NTD today?`,
            `show today's schedule`,
            `first lecture on Monday?`,
            `last lecture today?`
          ])
        );
        break;
      }
    }
  }
});

app.intent("countLectures", conv => {
  requireDataFile(conv);
  if (data === undefined) {
    data = require("./data/ICT16.json");
    conv.user.storage.class = "ICT16";
  }
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
          `${countLect}. At ${timeConvert(parseInt(key.substring(1)))} on ${
            days[i]
          }`
        ] = {
          synonyms: [
            `${countLect}. At ${timeConvert(parseInt(key.substring(1)))} on ${
              days[i]
            }`
          ],
          title: `${countLect}. At  ${timeConvert(parseInt(key.substring(1)))}`,
          description: `on ${days[i]}.`
        };

        console.log(
          `at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} on ${days[i]}`
        );
      }
    }
  }
  if (countLect >= 1) {
    conv.close(`Total ${countLect} Lectures`);
    conv.close(new List(result));
  } else {
    conv.close(
      `In this semester there aren't any lectures of ${prof} in your department`
    );
  }
  conv.ask(
    new Suggestions([
      `number of lectures of NTD`,
      `number of lectures of SKB`,
      `number of lectures of RJO`,
      `next lecture please?`,
      `Show Monday's schedule`,
      `whose last lecture is it?`,
      `first lecture today?`,
      `Whose lecture is it?`
    ])
  );
});

app.intent("freeSlots", conv => {
  requireDataFile(conv);
  if (data === undefined) {
    data = require("./data/ICT16.json");
    conv.user.storage.class = "ICT16";
  }
  let countFreeSlots = 0;
  const day = moment(conv.body.queryResult.parameters.date).day();
  const today = moment(conv.body.queryResult.parameters.date).format("dddd");
  const result = {
    title: `Free slots`,
    items: {}
  };
  if (today === "Saturday" || today === "Sunday") {
    conv.close(`<speak>Enjoy your weekend buddy!</speak>`);
    conv.ask(
      new Suggestions([
        "first lecture on Monday?",
        "last lecture today?",
        "first lecture tomorrow?"
      ])
    );
  } else {
    const entries = toArray(data[day][today]);
    for (const entry of entries) {
      const key = entry[0];
      const value = entry[1];
      if (value.type === "Free") {
        countFreeSlots++;
        const t = parseInt(key.substring(1));
        result.items[
          `${countFreeSlots}. At ${timeConvert(parseInt(key.substring(1)))}`
        ] = {
          synonyms: [
            `${countFreeSlots}. At ${timeConvert(parseInt(key.substring(1)))}`
          ],
          title: `${countFreeSlots}. At  ${timeConvert(
            parseInt(key.substring(1))
          )}`,
          description: `on ${today}.`
        };
      }
    }
    conv.close(`Total ${countFreeSlots} Slots`);
    conv.close(new List(result));
    conv.ask(
      new Suggestions([
        `number of lectures of NTD`,
        `number of lectures of SKB`,
        `number of lectures of RJO`,
        `next lecture please?`,
        `Show Monday's schedule`,
        `whose last lecture is it?`,
        `first lecture today?`,
        `Whose lecture is it?`
      ])
    );
  }
});

app.intent("setup_push", conv => {
  conv.ask(new UpdatePermission({ intent: "nextLectureIntent" }));
});

app.intent("finish_push_setup", conv => {
  if (conv.arguments.get("PERMISSION")) {
    const userID = conv.arguments.get("UPDATES_USER_ID");
    // code to save intent and userID in your db
    conv.close(`Ok, I'll start alerting you.`);
  } else {
    conv.close(`Ok, I won't alert you.`);
  }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
