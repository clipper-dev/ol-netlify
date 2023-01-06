const fetch = require("node-fetch");
//fetching liverpool tidal data
const API_ENDPOINT = `http://stenalive.co.uk/heysham.php`;

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