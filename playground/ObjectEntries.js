const data = require("../functions/data/4th-sem.json");
// Object.entries = function(data) {
//   var ownProps = Object.keys(data),
//     i = ownProps.length,
//     resArray = new Array(i); // preallocate the Array
//   while (i--) resArray[i] = [ownProps[i], data[ownProps[i]]];

//   return resArray;
// };

// console.log(arr());

// const obj1 = {
//   a: "A",
//   b: "B"
// };

// console.log(Object.entries(data[1]["Monday"]));
const mooData = data[1]["Monday"];

function toArray(moData) {
  console.log(Object.keys(moData));
  const ownProps = Object.keys(moData);

  var i = ownProps.length;
  console.log(i);
  resArray = new Array(i);
  // console.log(resArray);
  while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
  return resArray;
}
const entries = toArray(mooData);
// console.log(entries);
// console.log(entries);

const hourCodes = [
  "L9",
  "L10",
  "L11",
  "L12",
  "L13",
  "L14",
  "L15",
  "L16",
  "L17"
];
const profName = "Manish";
if (hourCodes[0] == entries[0]) console.log("right place");

for (let i = 0; i < entries.length; i++) {
  // console.log(entries[i][1].Professor);
  if (
    entries[i][1].type === "Lecture" &&
    entries[i][1].Professor.includes(profName)
  ) {
    const t = parseInt(entries[i][0].substring(1));
    // console.log(typeof t);
    // let inj = parseInt(t);
    // let inj = 14;
    // console.log(typeof inj);
    // console.log();
    // console.log(inj - 12);
    console.log(`Yes at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`}`);
    // break;
  }
}
