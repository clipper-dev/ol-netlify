const fetch = require("node-fetch");
//fetching metoffice weather data
const API_ENDPOINT = `https://www.metoffice.gov.uk/weather/specialist-forecasts/coast-and-sea/shipping-forecast`;

exports.handler = async (event, context) => {
  let response
  let html
  try {
    response = await fetch(API_ENDPOINT);
	html = await response.text();
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
	body: html
  }
}