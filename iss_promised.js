const request = require("request-promise-native");

//request IP address
const fetchMyIP = function() {
  return request("https://api.ipify.org?format=json");
};

//request Coordinates
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

//request fly over times based on coordinates
const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

//create promise with all the functions, return parsed data of fly over times
const timesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};


module.exports = {
  timesForMyLocation
};