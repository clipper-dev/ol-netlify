const fetch = require("node-fetch");
const { handler } = require("../functions/partner");
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
async function getData() {
	return await handler();
}
function parseData(data) {
	let parser = new DOMParser();
    let html = parser.parseFromString(data, "text/html");

    // Find all elements with the specified attribute
    let elements = html.querySelectorAll("[style='position:absolute;left:0px;top:304px;width:400px;height:200px;overflow:hidden;']");

    // Iterate over the elements and extract the text content
    let texts = [];
    for (let element of elements) {
      texts.push(element.textContent);
    }
    console.log("partnerHTML", html);
    console.log("partnerElements", elements);
    console.log("partner", texts);
}

const res = getData().then(
	(r) =>	parseData(r)
)
