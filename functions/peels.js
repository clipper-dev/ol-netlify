const fetch = require("node-fetch");
//fetching heyshamowo tidal data
const API_ENDPOINT = `https://peelports.port-log.net/live/Display.php?Cluster=Heysham`;

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