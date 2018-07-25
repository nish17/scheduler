const data = require("../functions/data/5th-sem.json");
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

for (let i = 0; i < entries.length; i++) {
  // console.log(entries[i][1].Professor.toLowerCase());
  if (
    entries[i][1].Professor != undefined &&
    entries[i][1].Professor === profName
  ) {
    const t = parseInt(entries[i][0].substring(1));
    console.log(`Yes at ${t - 12 > 0 ? `${t - 12} PM` : `${t} AM`}`);
    break;
  } else {
    if (entries[i][0] == "L17") {
      console.log("not found");
      break;
    }
  }
}
