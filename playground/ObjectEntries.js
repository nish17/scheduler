/* const today = "Modnay";

console.log(
  `Show ${
    today === "Saturday" || today === "Sunday" ? "Monday" : `${today}`
  }'s schedule`
);
 */
/* Count Lecuters of Faculty intent
const data = require("../functions/data/5th-sem.json");

function toArray(moData) {
  const ownProps = Object.keys(moData);
  var i = ownProps.length;
  resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], moData[ownProps[i]]];
  return resArray;
}

const profName = "Nishant Doshi";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let day = 1;
let countLect = 0;
console.log(`Lectures of ${profName}`);
for (var i = 0; i <= 4; i++) {
  // console.log(days[i]);
  const entries = toArray(data[day][days[i]]);
  day++;
  for (let j = 0; j < entries.length; j++) {
    if (
      entries[j][1].type === "Lecture" &&
      entries[j][1].Professor === profName
    ) {
      countLect++;
      const t = parseInt(entries[j][0].substring(1));

      console.log(
        `at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`} on ${days[i]}`
      );
    }
  }
}
console.log(`Total ${countLect} Lectures`);
 */
