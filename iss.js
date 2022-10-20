const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = (callback) => {
  //request ip address
  request("https://api.ipify.org?format=json", (error, response, body) => {
    //if error present, call callback with error to log
    if (error) return callback(error, null);
    //if status code isnt 200 print message
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }
    //parse ip address and call callback with no error and ip
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
const fetchCoordsByIP = (ip, callback) => {
  //request coordinates
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    //handle error with callback to log error
    if (error) return callback(error, null);
    
    const parsedBody = JSON.parse(body);
    
    //if body wasnt able to be parsed print error
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

    //get lat and long value, call callback with no errors and coordinates
    const { latitude, longitude } = parsedBody;
    callback(null, { latitude, longitude});
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  //request fly over times
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    //handle error, callback logs error
    if (error) return callback(error, null);
    //if status code isnt 200 print message
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    //parse the response in body to get fly over times, call callback with times
    const passTimes = JSON.parse(body).response;
    callback(null, passTimes);
  });
};

//chaining functions to work together
const nextISSTimesForMyLocation = (callback => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) return callback(error, null);
      
      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) return callback(error, null);
        
        callback(null, passTimes);
      });
    });
  });
});

module.exports = { nextISSTimesForMyLocation };