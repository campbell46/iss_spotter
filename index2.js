const { timesForMyLocation } = require("./iss_promised");

//prints final output into data format
const printPassTimes = (passTimes => {
  for (const pass of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
});

//after promise is passed, call printPassTimes with array of objects
timesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  //if error, log it
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });

