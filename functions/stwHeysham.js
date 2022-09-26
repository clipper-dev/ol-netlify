const fetch = require("node-fetch");

//const API_ENDPOINT = `http://217.41.30.20/seatruck/getweather.aspx?time=${Date.now()}`;

const API_ENDPOINT = "http://217.41.30.20/seatruck/getweather.aspx?time=1663718007294&stationid=1";
exports.handler = async (event, context) => {
  let response
  try {
    response = await fetch(API_ENDPOINT);
    response = await response.json();
    // handle response
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: response
    })
  }
}