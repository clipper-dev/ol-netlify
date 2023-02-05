export const windDegreesToName = (windDegrees) => {
  if (windDegrees > 360 || windDegrees < 0) windDegrees = windDegrees % 360;
  /* getting the string values */
  const WIND_DEGREE_CONST = 11.25;
  if (
    windDegrees > WIND_DEGREE_CONST * 31 &&
    WIND_DEGREE_CONST * 1 >= windDegrees
  )
    return "N";
  if (
    windDegrees > WIND_DEGREE_CONST * 1 &&
    WIND_DEGREE_CONST * 3 >= windDegrees
  )
    return "NNE";
  if (
    windDegrees > WIND_DEGREE_CONST * 3 &&
    WIND_DEGREE_CONST * 5 >= windDegrees
  )
    return "NE";
  if (
    windDegrees > WIND_DEGREE_CONST * 5 &&
    WIND_DEGREE_CONST * 7 >= windDegrees
  )
    return "ENE";
  if (
    windDegrees > WIND_DEGREE_CONST * 7 &&
    WIND_DEGREE_CONST * 9 >= windDegrees
  )
    return "E";
  if (
    windDegrees > WIND_DEGREE_CONST * 9 &&
    WIND_DEGREE_CONST * 11 >= windDegrees
  )
    return "ESE";
  if (
    windDegrees > WIND_DEGREE_CONST * 11 &&
    WIND_DEGREE_CONST * 13 >= windDegrees
  )
    return "SE";
  if (
    windDegrees > WIND_DEGREE_CONST * 13 &&
    WIND_DEGREE_CONST * 15 >= windDegrees
  )
    return "SSE";
  if (
    windDegrees > WIND_DEGREE_CONST * 15 &&
    WIND_DEGREE_CONST * 17 >= windDegrees
  )
    return "S";
  if (
    windDegrees > WIND_DEGREE_CONST * 17 &&
    WIND_DEGREE_CONST * 19 >= windDegrees
  )
    return "SSW";
  if (
    windDegrees > WIND_DEGREE_CONST * 19 &&
    WIND_DEGREE_CONST * 21 >= windDegrees
  )
    return "SW";
  if (
    windDegrees > WIND_DEGREE_CONST * 21 &&
    WIND_DEGREE_CONST * 23 >= windDegrees
  )
    return "WSW";
  if (
    windDegrees > WIND_DEGREE_CONST * 23 &&
    WIND_DEGREE_CONST * 25 >= windDegrees
  )
    return "W";
  if (
    windDegrees > WIND_DEGREE_CONST * 25 &&
    WIND_DEGREE_CONST * 27 >= windDegrees
  )
    return "WNW";
  if (
    windDegrees > WIND_DEGREE_CONST * 27 &&
    WIND_DEGREE_CONST * 29 >= windDegrees
  )
    return "NW";
  if (
    windDegrees > WIND_DEGREE_CONST * 29 &&
    WIND_DEGREE_CONST * 31 >= windDegrees
  )
    return "NNW";
};

export const heyshamTidalCurrent = (timeToHighWater, range) => {
  const GLADSTONE_SPRING = 8.4;
  const GLADSTONE_NEAP = 4.4;
  let springRate = 0;
  let neapRate = 0;
  range = Math.abs(range);
  /* getting the time in relation to high water */
  const heightRatio =
    (range - GLADSTONE_NEAP) / (GLADSTONE_SPRING - GLADSTONE_NEAP);
  const currentm6 = 0;
  const currentm5 = 0.1 + 0.1 * heightRatio;
  const currentm4 = 0.4 + 0.1 * heightRatio;
  const currentm3 = 0.8 + 0.6 * heightRatio;
  const currentm2 = 1.4 + 1 * heightRatio;
  const currentm1 = 1.3 + 0.9 * heightRatio;
  const currentHW = 0.5 + 0.3 * heightRatio;
  const currentp1 = 0.7 + 0.3 * heightRatio;
  const currentp2 = 1.2 + 0.8 * heightRatio;
  const currentp3 = 1.3 + 0.9 * heightRatio;
  const currentp4 = 0.9 + 0.4 * heightRatio;
  const currentp5 = 0.4 + 0.1 * heightRatio;
  const currentp6 = 0;
  while (true) {
    if (timeToHighWater > -6) {
      break;
    }
    timeToHighWater = timeToHighWater + 12;
  }
  if (timeToHighWater > 6) {
    return [0, "ebbing"];
  } else if (timeToHighWater > 5) {
    return [0.1, "ebbing"];
  } else if (timeToHighWater > 4) {
    const current = currentm5 + (currentm4 - currentm5) * (5 - timeToHighWater);
    return [current, "flooding"];
  } else if (timeToHighWater > 3) {
    const current = currentm4 + (currentm3 - currentm4) * (4 - timeToHighWater);
    return [current, "flooding"];
  } else if (timeToHighWater > 2) {
    const current = currentm3 + (currentm2 - currentm3) * (3 - timeToHighWater);
    return [current, "flooding"];
  } else if (timeToHighWater > 1) {
    const current = currentm2 + (currentm1 - currentm2) * (2 - timeToHighWater);
    return [current, "flooding"];
  } else if (timeToHighWater > 0) {
    /* high water */
    const current = currentm1 + (currentHW - currentm1) * (1 - timeToHighWater);
    return [current, "flooding"];
  } else if (timeToHighWater > -1) {
    const current = currentHW + (currentp1 - currentHW) * timeToHighWater;
    return [current, "ebbing"];
  } else if (timeToHighWater > -2) {
    const current = currentp1 + (currentp2 - currentp1) * (1 + timeToHighWater);
    return [current, "ebbing"];
  } else if (timeToHighWater > -3) {
    const current = currentp2 + (currentp3 - currentp2) * (2 + timeToHighWater);
    return [current, "ebbing"];
  } else if (timeToHighWater > -4) {
    const current = currentp3 + (currentp4 - currentp3) * (3 + timeToHighWater);
    return [current, "ebbing"];
  } else if (timeToHighWater > -5) {
    return [0.1, "ebbing"];
  } else if (timeToHighWater > -6) {
    return [0, "ebbing"];
  }
};

export const windForecast = (dom) => {
  let data = dom;
  data = data.getElementsByTagName("body")[0].children[0].children[1];
  data = data.querySelectorAll(`[id="fc-table"]`)[0];

  return data;
};

export const tideHourly = (data, timeNow, timezoneLoaded) => {
  /* looping for the current prediction */
  let tides = [];
  for (const event in data.tidalHeightOccurrenceList) {
    const _date = data.tidalHeightOccurrenceList[event].dateTime;

    /* compare currentDate and _date and check which is later */
    const _dateObj = new Date(_date);

    if (_dateObj > timeNow) {
      for (let i = 0; i < 24; i++) {
        const movement =
          data.tidalHeightOccurrenceList[Number.parseInt(event) + 4 * i]
            .height -
          data.tidalHeightOccurrenceList[Number.parseInt(event) + 2 * i].height;
        let tideTime;
        if (timezoneLoaded === "en-GB") {
          tideTime = new Date(
            new Date(
              data.tidalHeightOccurrenceList[
                Number.parseInt(event) + 2 * i
              ].dateTime
            ).getTime() + 3600000
          );
        } else {
          tideTime = new Date(
            data.tidalHeightOccurrenceList[
              Number.parseInt(event) + 2 * i
            ].dateTime
          );
        }
        const tide = {
          time:
            tideTime.getFullYear() +
            "-" +
            (tideTime.getDate() > 9
              ? tideTime.getDate()
              : "0" + tideTime.getDate()) +
            "-" +
            (tideTime.getMonth() + 1) +
            " " +
            (tideTime.getHours() > 9
              ? tideTime.getHours()
              : "0" + tideTime.getHours()) +
            "" +
            (tideTime.getMinutes() > 9
              ? tideTime.getMinutes()
              : "0" + tideTime.getMinutes()),
          dateTime:
            data.tidalHeightOccurrenceList[Number.parseInt(event) + 2 * i]
              .dateTime,
          height:
            Math.round(
              100 *
                data.tidalHeightOccurrenceList[Number.parseInt(event) + 2 * i]
                  .height
            ) / 100,
          movement: Math.round(100 * movement) / 100,
        };
        tides.push(tide);
      }
      return tides;
    }
  }
  return tides;
};
