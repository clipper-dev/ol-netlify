export const windDegreesToName = (windDegrees) => {
  if (windDegrees > 360 || windDegrees < 0) windDegrees = windDegrees % 360;
  /* getting the string values */
  const WIND_DEGREE_CONST = 11.25;
  if (windDegrees > WIND_DEGREE_CONST * 31 && WIND_DEGREE_CONST * 1 >= windDegrees) return "N";
  if (windDegrees > WIND_DEGREE_CONST * 1 && WIND_DEGREE_CONST * 3 >= windDegrees) return "NNE";
  if (windDegrees > WIND_DEGREE_CONST * 3 && WIND_DEGREE_CONST * 5 >= windDegrees) return "NE";
  if (windDegrees > WIND_DEGREE_CONST * 5 && WIND_DEGREE_CONST * 7 >= windDegrees) return "ENE";
  if (windDegrees > WIND_DEGREE_CONST * 7 && WIND_DEGREE_CONST * 9 >= windDegrees) return "E";
  if (windDegrees > WIND_DEGREE_CONST * 9 && WIND_DEGREE_CONST * 11 >= windDegrees) return "ESE";
  if (windDegrees > WIND_DEGREE_CONST * 11 && WIND_DEGREE_CONST * 13 >= windDegrees) return "SE";
  if (windDegrees > WIND_DEGREE_CONST * 13 && WIND_DEGREE_CONST * 15 >= windDegrees) return "SSE";
  if (windDegrees > WIND_DEGREE_CONST * 15 && WIND_DEGREE_CONST * 17 >= windDegrees) return "S";
  if (windDegrees > WIND_DEGREE_CONST * 17 && WIND_DEGREE_CONST * 19 >= windDegrees) return "SSW";
  if (windDegrees > WIND_DEGREE_CONST * 19 && WIND_DEGREE_CONST * 21 >= windDegrees) return "SW";
  if (windDegrees > WIND_DEGREE_CONST * 21 && WIND_DEGREE_CONST * 23 >= windDegrees) return "WSW";
  if (windDegrees > WIND_DEGREE_CONST * 23 && WIND_DEGREE_CONST * 25 >= windDegrees) return "W";
  if (windDegrees > WIND_DEGREE_CONST * 25 && WIND_DEGREE_CONST * 27 >= windDegrees) return "WNW";
  if (windDegrees > WIND_DEGREE_CONST * 27 && WIND_DEGREE_CONST * 29 >= windDegrees) return "NW";
  if (windDegrees > WIND_DEGREE_CONST * 29 && WIND_DEGREE_CONST * 31 >= windDegrees) return "NNW";
};
