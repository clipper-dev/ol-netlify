import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Skeleton from "./components/Skeleton";
import TideHourly from "./components/TideHourly/TideHourly";
import Wind from "./pages/Wind";
import Sea from "./pages/Sea";
import Weather from "./pages/Weather";
import Settings from "./pages/Settings";
import styles from "./styles/Home.module.css";
/* nav functions */
import {
  heyshamTidalCurrent,
  tideHourly,
  windDegreesToName,
  windForecast,
} from "./utils/nav";
import {
  autoFetchState,
  lastFetchState,
  loadedState,
  skeletonState,
  timezoneValueState,
} from "./atoms/fetchAtom";
import { useRecoilState } from "recoil";
import { metofficeDataState, showMetofficeState } from "./atoms/metofficeAtom";
import {
  heyshamWindDataState,
  heyshamWindPartnerDataState,
  heyshamWindPeelsDataState,
  showHeyshamWindOwnState,
  showHeyshamWindPartnerState,
  showHeyshamWindPeelsState,
  showWarrenpointWindState,
  warrenpointWindDataState,
} from "./atoms/windAtom";
import Tide from "./pages/Tide";
import {
  currentHeyshamState,
  currentWarrenpointState,
  displayDataHeyshamState,
  displayDataWarrenpointState,
  heyshamTideDataHourlyState,
  heyshamTideDataState,
  showHeyshamHourlyState,
  showHeyshamTideState,
  showWarrenpointHourlyState,
  showWarrenpointTideState,
  tidalCurrentHeyshamNowState,
  warrenpointTideDataHourlyState,
  warrenpointTideDataState,
} from "./atoms/tidesAtom";

function App() {
  /* app settings */
  const [timezoneValue, setTimezoneValue] = useRecoilState(timezoneValueState);
  const [autoFetch, setAutofetch] = useRecoilState(autoFetchState);
  const [autofetchInterval, setAutofetchInterval] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = [
    { name: "Tides", value: "tides" },
    { name: "Wind", value: "wind" },
    { name: "Sea", value: "sea" },
    { name: "Weather", value: "weather" },
    { name: "Settings", value: "settings" },
  ];
  /* state variables */
  const [showHeyshamHourly, setShowHeyshamHourly] = useRecoilState(
    showHeyshamHourlyState
  );
  const [showWarrenpointHourly, setShowWarrenpointHourly] = useRecoilState(
    showWarrenpointHourlyState
  );

  const [showHeyshamTide, setShowHeyshamTide] =
    useRecoilState(showHeyshamTideState);
  const [heyshamTideData, setHeyshamTideData] =
    useRecoilState(heyshamTideDataState);

  const [showWarrenpointTide, setShowWarrenpointTide] = useRecoilState(
    showWarrenpointTideState
  );
  const [warrenpointTideData, setWarrenpointTideData] = useRecoilState(
    warrenpointTideDataState
  );

  const [heyshamTideDataHourly, setHeyshamTideDataHourly] = useRecoilState(
    heyshamTideDataHourlyState
  );
  const [warrenpointTideDataHourly, setWarrenpointTideDataHourly] =
    useRecoilState(warrenpointTideDataHourlyState);

  const [showHeyshamWindOwn, setShowHeyshamWindOwn] = useRecoilState(
    showHeyshamWindOwnState
  );
  const [heyshamWindData, setHeyshamWindData] =
    useRecoilState(heyshamWindDataState);

  const [showHeyshamWindPartner, setShowHeyshamWindPartner] = useRecoilState(
    showHeyshamWindPartnerState
  );
  const [heyshamWindPartnerData, setHeyshamWindPartnerData] = useRecoilState(
    heyshamWindPartnerDataState
  );

  const [showHeyshamWindPeels, setShowHeyshamWindPeels] = useRecoilState(
    showHeyshamWindPeelsState
  );
  const [heyshamWindPeelsData, setHeyshamWindPeelsData] = useRecoilState(
    heyshamWindPeelsDataState
  );

  const [showWarrenpointWindOwn, setShowWarrenpointWindOwn] = useRecoilState(
    showWarrenpointWindState
  );
  const [warrenpointWindData, setWarrenpointWindData] = useRecoilState(
    warrenpointWindDataState
  );

  const [showMetoffice, setShowMetoffice] = useRecoilState(showMetofficeState);
  const [metofficeData, setMetofficeData] = useRecoilState(metofficeDataState);

  const [showHeyshamWindForecast, setShowHeyshamWindForecast] = useState(true);
  const [heyshamWindForecast, setHeyshamWindForecast] = useState({});

  const [showWarrenpointWindForecast, setShowWarrenpointWindForecast] =
    useState(true);
  const [warrenpointWindForecast, setWarrenpointWindForecast] = useState({});

  /* functions */
  function closeHeyshamHourly() {
    setShowHeyshamHourly(false);
  }
  function closeWarrenpointHourly() {
    setShowWarrenpointHourly(false);
  }

  /* loading state */
  const [loaded, setLoaded] = useRecoilState(loadedState);
  const [skeleton, setSkeleton] = useRecoilState(skeletonState);
  const [lastFetch, setLastFetch] = useRecoilState(lastFetchState);

  const [displayDataHeysham, setDisplayDataHeysham] = useRecoilState(
    displayDataHeyshamState
  );
  const [displayDataWarrenpoint, setDisplayDataWarrenpoint] = useRecoilState(
    displayDataWarrenpointState
  );
  const [currentHeysham, setCurrentHeysham] =
    useRecoilState(currentHeyshamState);
  const [tidalCurrentHeyshamNow, setTidalCurrentHeyshamNow] = useRecoilState(
    tidalCurrentHeyshamNowState
  );
  const [currentWarrenpoint, setCurrentWarrenpoint] = useRecoilState(
    currentWarrenpointState
  );

  const [errorPopup, setErrorPopup] = useState(false);
  /* fetch data */
  const fetchData = async (timezoneLoaded) => {
    let parser = new DOMParser();
    let currentDate = new Date();

    /* tide heysham */
    let _showHeyshamTide = true;
    const heyshamTideDataRes = await axios
      .get("/.netlify/functions/heysham")
      .catch((err) => {
        _showHeyshamTide = false;
        setErrorPopup(true);
      });
    console.log("HEYSHAM TIDE", heyshamTideDataRes);
    if (_showHeyshamTide) {
      updateTimezoneHeysham(heyshamTideDataRes);
      for (const event in heyshamTideDataRes.data.data
        .tidalHeightOccurrenceList) {
        const _date =
          heyshamTideDataRes.data.data.tidalHeightOccurrenceList[event]
            .dateTime;

        /* compare currentDate and _date and check which is later */
        const _dateObj = new Date(_date);
        if (_dateObj > currentDate) {
          /* get the value of the current height of the tide */
          /* calculate value for current time by interpolating values from the array */
          const h = 30;
          const x0 = 30;
          /* get current minutes */
          const m = new Date().getMinutes();
          /* get current seconds */
          const s = new Date().getSeconds();
          /* get current amount of minutes and seconds */
          let x = m + s / 60;
          if (x > 30) {
            x = x - 30;
          }
          /* read values from the array */
          const ym1 = Number.parseFloat(
            heyshamTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event) - 1
            ].height
          );
          const y0 = Number.parseFloat(
            heyshamTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event)
            ].height
          );
          const yp1 = Number.parseFloat(
            heyshamTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event) + 1
            ].height
          );

          /* calculate the value of the current height of the tide */
          /* do a cubic interpolation of the value */
          const y =
            y0 +
            (0.5 * (yp1 - ym1) * (x - x0)) / h +
            (0.5 * (yp1 - 2 * y0 + ym1) * (x - x0) * (x - x0)) / (h * h);

          const _currentHeyshamHeight = y;
          /* check if flood or ebb */
          /* if consequent is higher than previous then it is flood */
          if (
            heyshamTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event) - 1
            ].height <
            heyshamTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event)
            ].height
          ) {
            setCurrentHeysham({
              ...currentHeysham,
              height: _currentHeyshamHeight,
              tideState: "flood",
            });
          } else {
            setCurrentHeysham({
              ...currentHeysham,
              height: _currentHeyshamHeight,
              tideState: "ebb",
            });
          }
          break;
        }
      }
      /* checking the closes high water in heysham and calculating the tidal current in heysham */
      for (const event in heyshamTideDataRes.data.data.tidalEventList) {
        const _date =
          heyshamTideDataRes.data.data.tidalEventList[event].dateTime;
        const _dateObj = new Date(_date);

        /* compare currentDate and _date and check which is later */
        if (_dateObj > currentDate) {
          const tideBefore = Number.parseFloat(
            heyshamTideDataRes.data.data.tidalEventList[
              Number.parseInt(event) - 1
            ].height
          );
          const tideAfter = Number.parseFloat(
            heyshamTideDataRes.data.data.tidalEventList[Number.parseInt(event)]
              .height
          );
          const range = Math.abs(
            heyshamTideDataRes.data.data.tidalEventList[Number.parseInt(event)]
              .height -
              heyshamTideDataRes.data.data.tidalEventList[
                Number.parseInt(event - 1)
              ].height
          );
          const _date2 =
            heyshamTideDataRes.data.data.tidalEventList[
              Number.parseInt(event - 1)
            ].dateTime;

          /* compare currentDate and _date and check which is later */
          const _dateObj2 = new Date(_date2); /* 
        console.log("event before: ", _date2);
        console.log("event now: ", currentDate);
        console.log("event after: ", _date);
        console.log(
          "time between previous event and now: ",
          _dateObj2 - currentDate
        );
        console.log(
          "time between now and consequent event: ",
          currentDate - _dateObj
        ); */

          /* check which local extremum is the high water - the one before now or after */
          if (tideAfter - tideBefore > 0) {
            /* tide after is the closer high water */
            const timeDifference = _dateObj - currentDate;
            const hoursToHW = timeDifference / 3600000;
            const [currentHeight, currentDirection] = heyshamTidalCurrent(
              hoursToHW,
              range
            ); /* 
          console.log(hoursToHW, range); */

            setTidalCurrentHeyshamNow({
              height: currentHeight,
              direction: currentDirection,
            });
          } else {
            const timeDifference = _dateObj2 - currentDate;
            const hoursToHW = timeDifference / 3600000; /* 
          console.log(hoursToHW, range); */
            const [currentHeight, currentDirection] = heyshamTidalCurrent(
              hoursToHW,
              range
            );
            setTidalCurrentHeyshamNow({
              height: currentHeight,
              direction: currentDirection,
            });
          }
          break;
        }
      }
      setShowHeyshamTide(true);
      setHeyshamTideData(heyshamTideDataRes);
    } else {
      setShowHeyshamTide(false);
    }
    /* TIDE HEYSHAM HOURLY */
    const hymHourly = tideHourly(
      heyshamTideDataRes.data.data,
      currentDate,
      timezoneLoaded
    );
    setHeyshamTideDataHourly(hymHourly);
    console.log("hujszam", hymHourly);

    /* tide warrenpoint */
    let _showWarrenpointTide = true;
    const warrenpointTideDataRes = await axios
      .get("/.netlify/functions/warrenpoint")
      .catch((err) => {
        _showWarrenpointTide = false;
        setErrorPopup(true);
      });

    if (_showWarrenpointTide) {
      updateTimezoneWarrenpoint(warrenpointTideDataRes);
      for (const event in warrenpointTideDataRes.data.data
        .tidalHeightOccurrenceList) {
        const _date =
          warrenpointTideDataRes.data.data.tidalHeightOccurrenceList[event]
            .dateTime;
        /* compare currentDate and _date and check which is later */
        const _dateObj = new Date(_date);
        if (_dateObj > currentDate) {
          /* calculate value for current time by interpolating values from the array */
          const h = 30;
          const x0 = 30;
          /* get current minutes */
          const m = new Date().getMinutes();
          /* get current seconds */
          const s = new Date().getSeconds();
          /* get current amount of minutes and seconds */
          let x = m + s / 60;
          if (x > 30) {
            x = x - 30;
          }
          /* read values from the array */
          const ym1 = Number.parseFloat(
            warrenpointTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event) - 1
            ].height
          );
          const y0 = Number.parseFloat(
            warrenpointTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event)
            ].height
          );
          const yp1 = Number.parseFloat(
            warrenpointTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event) + 1
            ].height
          );

          /* calculate the value of the current height of the tide */
          /* do a cubic interpolation of the value */
          const y =
            y0 +
            (0.5 * (yp1 - ym1) * (x - x0)) / h +
            (0.5 * (yp1 - 2 * y0 + ym1) * (x - x0) * (x - x0)) / (h * h);

          const _currentWarrenpointHeight = y;

          /* check if flood or ebb */
          /* if consequent is higher than previous then it is flood */
          if (
            warrenpointTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event) - 1
            ].height <
            warrenpointTideDataRes.data.data.tidalHeightOccurrenceList[
              Number.parseInt(event)
            ].height
          ) {
            setCurrentWarrenpoint({
              ...currentWarrenpoint,
              height: _currentWarrenpointHeight,
              tideState: "flood",
            });
          } else {
            setCurrentWarrenpoint({
              ...currentWarrenpoint,
              height: _currentWarrenpointHeight,
              tideState: "ebb",
            });
          }
          break;
        }
      }
      setShowWarrenpointTide(true);
      setWarrenpointTideData(warrenpointTideDataRes);
    } else {
      setShowWarrenpointTide(false);
    }
    /* TIDE WARRENPOINT HOURLY */
    const wptHourly = tideHourly(
      warrenpointTideDataRes.data.data,
      currentDate,
      timezoneLoaded
    );
    setWarrenpointTideDataHourly(wptHourly);
    console.log("wpt", wptHourly);

    /* wind heysham */
    let _showHeyshamWindOwn = true;
    const heyshamWindRes = await axios
      .get("/.netlify/functions/stwHeysham")
      .catch((err) => {
        _showHeyshamWindOwn = false;
        setErrorPopup(true);
      });
    if (_showHeyshamWindOwn) {
      setShowHeyshamWindOwn(true);
      setHeyshamWindData(heyshamWindRes.data.data);
    } else {
      setShowHeyshamWindOwn(false);
    }

    /* wind warrenpoint*/
    let _showWarrenpointWindOwn = true;
    const warrenpointWindRes = await axios
      .get("/.netlify/functions/stwWarrenpoint")
      .catch((err) => {
        _showWarrenpointWindOwn = false;
        setErrorPopup(true);
      });
    if (_showWarrenpointWindOwn) {
      setShowWarrenpointWindOwn(true);
      setWarrenpointWindData(warrenpointWindRes.data.data);
    } else {
      setShowWarrenpointWindOwn(false);
    }

    /* partner wind */
    let _showHeyshamWindPartner = true;
    const partnerWindData = await axios
      .get("/.netlify/functions/partner")
      .catch((err) => {
        _showHeyshamWindPartner = false;
        setErrorPopup(true);
      });
    if (_showHeyshamWindPartner) {
      let html = parser.parseFromString(partnerWindData.data, "text/html");

      // Find all elements with the specified attribute
      let elements = html.querySelectorAll(
        "[style='font-family:Arial; color:#FF0000; font-size: 60px; text-align:center;']"
      );

      // Iterate over the elements and extract the text content
      let texts = [];
      for (let element of elements) {
        texts.push(element.textContent.slice(1, 6));
      }
      texts[0] = texts[0].slice(0, 4);
      texts[1] = texts[1].slice(0, 4);

      /* success */
      setShowHeyshamWindPartner(true);
      setHeyshamWindPartnerData(texts);
    } else {
      setShowHeyshamWindPartner(false);
    }
    /* peels WX data */
    let _showHeyshamWindPeels = true;
    const peelsData = await axios
      .get("/.netlify/functions/peels")
      .catch((err) => {
        _showHeyshamWindPeels = false;
        setErrorPopup(true);
      });
    if (_showHeyshamWindPeels) {
      let htmlPeels = parser.parseFromString(peelsData.data, "text/html");

      // Find all elements with the specified attribute
      let peels = [];
      peels.push(
        htmlPeels.querySelectorAll('[Parameter="10003"]')[0].textContent
      ); //observed
      peels.push(
        htmlPeels.querySelectorAll('[Parameter="10004"]')[0].textContent
      ); //predicted
      peels.push(
        htmlPeels.querySelectorAll('[Parameter="10005"]')[0].textContent
      ); //surge, basciacally obs-pred
      peels.push(
        htmlPeels.querySelectorAll('[Parameter="50003"]')[0].textContent
      ); //wind direction
      peels.push(
        htmlPeels.querySelectorAll('[Parameter="50002"]')[0].textContent
      ); //wind speed
      peels.push(
        htmlPeels.querySelectorAll('[Parameter="50007"]')[0].textContent
      ); //gust direction
      peels.push(
        htmlPeels.querySelectorAll('[Parameter="50006"]')[0].textContent
      ); //gust speed
      /* success */
      setShowHeyshamWindPeels(true);
      setHeyshamWindPeelsData(peels);
    } else {
      setShowHeyshamWindPeels(false);
    }
    /* fetching metoffice data */
    let _metofficeData = true;
    const metoffice = await axios
      .get("/.netlify/functions/metoffice")
      .catch((err) => {
        _metofficeData = false;
        setErrorPopup(true);
      });
    if (_metofficeData) {
      let htmlMetoffice = parser.parseFromString(metoffice.data, "text/html");
      let irishsea = htmlMetoffice.querySelectorAll(
        '[data-value="irishsea"]'
      )[0].children[1];
      let issueTime = htmlMetoffice.querySelectorAll(
        '[id="sea-forecast-time"]'
      )[0].children[0];
      let irishseaForecast = [];
      if (irishsea.children.length === 2) {
        /* gale warning */
        const galeWarning = {
          gale: true,
          galeText: irishsea.children[0].children[1].children[1].textContent,
          issueTime: irishsea.children[0].children[1].children[0].textContent
            .split(`\n`)
            .join(""),
        };
        irishseaForecast.push(galeWarning);
        /* wind */
        irishseaForecast.push(irishsea.children[1].children[1].textContent);
        /* sea state */
        irishseaForecast.push(irishsea.children[1].children[3].textContent);
        /* weather */
        irishseaForecast.push(irishsea.children[1].children[5].textContent);
        /* visibility */
        irishseaForecast.push(irishsea.children[1].children[7].textContent);
      } else {
        /* no gale warning */
        const galeWarning = {
          gale: false,
        };
        irishseaForecast.push(galeWarning);
        /* wind */
        irishseaForecast.push(irishsea.children[0].children[1].textContent);
        /* sea state */
        irishseaForecast.push(irishsea.children[0].children[3].textContent);
        /* weather */
        irishseaForecast.push(irishsea.children[0].children[5].textContent);
        /* visibility */
        irishseaForecast.push(irishsea.children[0].children[7].textContent);
      }
      irishseaForecast.push(issueTime.textContent);
      /* success */
      setShowMetoffice(true);
      setMetofficeData(irishseaForecast);
    } else {
      setShowMetoffice(false);
    }

    /* heysham forecast */
    let _showHeyshamWindForecast = true;
    const heyshamForecast = await axios
      .get("/.netlify/functions/heyshamForecast")
      .catch((err) => {
        _showHeyshamWindForecast = false;
        setErrorPopup(true);
      });
    if (_showHeyshamWindForecast) {
      let htmlHeyshamForecast = parser.parseFromString(
        heyshamForecast.data,
        "text/html"
      );
      let heyshamForecastData = windForecast(htmlHeyshamForecast);
      console.log("Heysham Forecast", heyshamForecastData);

      /* success */
      setShowHeyshamWindForecast(true);
      setHeyshamWindForecast(heyshamForecastData);
    } else {
      setShowHeyshamWindForecast(false);
    }

    /* warrenpoint forecast */
    let _showWarrenpointWindForecast = true;
    const warrenpointForecast = await axios
      .get("/.netlify/functions/warrenpointForecast")
      .catch((err) => {
        _showWarrenpointWindForecast = false;
        setErrorPopup(true);
      });
    if (_showWarrenpointWindForecast) {
      let htmlWarrenpointForecast = parser.parseFromString(
        warrenpointForecast.data,
        "text/html"
      );
      let warrenpointForecastData = windForecast(htmlWarrenpointForecast);
      console.log("Warrenpoint Forecast", warrenpointForecastData);

      /* success */
      setShowWarrenpointWindForecast(true);
      setWarrenpointWindForecast(warrenpointForecastData);
    } else {
      setShowWarrenpointWindForecast(false);
    }

    /* set loaded flag to true because all the data should be already fetched */
    setLoaded(true);
    setSkeleton(true);
    setLastFetch(currentDate.getHours() + ":" + currentDate.getMinutes());
  };
  /* refs */
  const timezoneSelect = useRef(null);
  /* fetching with use effect */
  useEffect(() => {
    const timezoneLoaded = localStorage.getItem("timezone") ?? 0;
    setTimezone(timezoneLoaded);
    const _autofetch = localStorage.getItem("autofetch") ?? false;
    console.log("Set initial autofetch to " + _autofetch);
    toggleAutofetch(_autofetch);
    fetchData(timezoneLoaded);
  }, []);
  function toggleAutofetch(state) {
    console.log("Toggling autofetch to " + state);
    localStorage.setItem("autofetch", state);
    setAutofetch(state);
    if (state === true) {
      console.log("Auto fetching enabled");
      const killFetch = setInterval(() => {
        fetchData();
      }, 60000);
      setAutofetchInterval(killFetch);
    } else {
      try {
        console.log("Auto fetching disabled");
        clearInterval(autofetchInterval);
      } catch {
        console.log("Error while disabling auto fetching");
      }
    }
  }

  /* set timezone */
  const setTimezone = (timezone) => {
    try {
      setTimezoneValue(timezone);
      localStorage.setItem("timezone", timezone);
      console.log("Setting the timezone to " + timezone);
    } catch (error) {
      console.error("Error getting time zone. Switched to UTC.");
      setTimezone("UTC");
    }
  };
  const toggleTimezone = () => {
    if (timezoneValue === "UTC") {
      setTimezone("en-GB");
    } else {
      setTimezone("UTC");
    }
    updateTimezoneHeysham(heyshamTideData);
    updateTimezoneWarrenpoint(warrenpointTideData);
  };
  const updateTimezoneHeysham = (heyshamTideDataRes) => {
    const timezoneLoaded = localStorage.getItem("timezone") ?? 0;
    const currentDate = new Date();
    let _displayData;
    for (const event in heyshamTideDataRes.data.data.tidalEventList) {
      const _date = heyshamTideDataRes.data.data.tidalEventList[event].dateTime;
      /* compare currentDate and _date and check which is later */
      const _dateObj = new Date(_date);
      if (_dateObj > currentDate) {
        //first major event that will happen
        const _date1 =
          heyshamTideDataRes.data.data.tidalEventList[Number.parseInt(event)]
            .dateTime;
        const _date2 =
          heyshamTideDataRes.data.data.tidalEventList[
            Number.parseInt(event) + 1
          ].dateTime;
        const _date3 =
          heyshamTideDataRes.data.data.tidalEventList[
            Number.parseInt(event) + 2
          ].dateTime;
        const _date4 =
          heyshamTideDataRes.data.data.tidalEventList[
            Number.parseInt(event) + 3
          ].dateTime;
        let _dateObj1;
        let _dateObj2;
        let _dateObj3;
        let _dateObj4;

        if (timezoneLoaded === "en-GB") {
          _dateObj1 = new Date(new Date(_date1).getTime() + 3600000);
          _dateObj2 = new Date(new Date(_date2).getTime() + 3600000);
          _dateObj3 = new Date(new Date(_date3).getTime() + 3600000);
          _dateObj4 = new Date(new Date(_date4).getTime() + 3600000);
        } else {
          _dateObj1 = new Date(_date1);
          _dateObj2 = new Date(_date2);
          _dateObj3 = new Date(_date3);
          _dateObj4 = new Date(_date4);
        }
        setDisplayDataHeysham({
          ...displayDataHeysham,
          heyshamTides: [
            {
              time:
                _dateObj1.getFullYear() +
                "-" +
                (_dateObj1.getMonth() > 8
                  ? _dateObj1.getMonth() + 1
                  : "0" + (_dateObj1.getMonth() + 1)) +
                "-" +
                (_dateObj1.getDate() > 9
                  ? _dateObj1.getDate()
                  : "0" + _dateObj1.getDate()) +
                " " +
                (_dateObj1.getHours() > 9
                  ? _dateObj1.getHours()
                  : "0" + _dateObj1.getHours()) +
                "" +
                (_dateObj1.getMinutes() > 9
                  ? _dateObj1.getMinutes()
                  : "0" + _dateObj1.getMinutes()),
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].height,
            },
            {
              time:
                _dateObj2.getFullYear() +
                "-" +
                (_dateObj2.getMonth() > 8
                  ? _dateObj2.getMonth() + 1
                  : "0" + (_dateObj2.getMonth() + 1)) +
                "-" +
                (_dateObj2.getDate() > 9
                  ? _dateObj2.getDate()
                  : "0" + _dateObj2.getDate()) +
                " " +
                (_dateObj2.getHours() > 9
                  ? _dateObj2.getHours()
                  : "0" + _dateObj2.getHours()) +
                "" +
                (_dateObj2.getMinutes() > 9
                  ? _dateObj2.getMinutes()
                  : "0" + _dateObj2.getMinutes()),

              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].height,
            },
            {
              time:
                _dateObj3.getFullYear() +
                "-" +
                (_dateObj3.getMonth() > 8
                  ? _dateObj3.getMonth() + 1
                  : "0" + (_dateObj3.getMonth() + 1)) +
                "-" +
                (_dateObj3.getDate() > 9
                  ? _dateObj3.getDate()
                  : "0" + _dateObj3.getDate()) +
                " " +
                (_dateObj3.getHours() > 9
                  ? _dateObj3.getHours()
                  : "0" + _dateObj3.getHours()) +
                "" +
                (_dateObj3.getMinutes() > 9
                  ? _dateObj3.getMinutes()
                  : "0" + _dateObj3.getMinutes()),
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].height,
            },
            {
              time:
                _dateObj4.getFullYear() +
                "-" +
                (_dateObj4.getMonth() > 8
                  ? _dateObj4.getMonth() + 1
                  : "0" + (_dateObj4.getMonth() + 1)) +
                "-" +
                (_dateObj4.getDate() > 9
                  ? _dateObj4.getDate()
                  : "0" + _dateObj4.getDate()) +
                " " +
                (_dateObj4.getHours() > 9
                  ? _dateObj4.getHours()
                  : "0" + _dateObj4.getHours()) +
                "" +
                (_dateObj4.getMinutes() > 9
                  ? _dateObj4.getMinutes()
                  : "0" + _dateObj4.getMinutes()),
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].height,
            },
          ],
        });
        break;
      }
    }
  };
  const updateTimezoneWarrenpoint = (warrenpointTideDataRes) => {
    const timezoneLoaded = localStorage.getItem("timezone") ?? 0;
    const currentDate = new Date();
    let _displayData;

    for (const event in warrenpointTideDataRes.data.data.tidalEventList) {
      const _date =
        warrenpointTideDataRes.data.data.tidalEventList[event].dateTime;
      /* compare currentDate and _date and check which is later */
      const _dateObj = new Date(_date);
      if (_dateObj > currentDate) {
        const _date1 =
          warrenpointTideDataRes.data.data.tidalEventList[
            Number.parseInt(event)
          ].dateTime;
        const _date2 =
          warrenpointTideDataRes.data.data.tidalEventList[
            Number.parseInt(event) + 1
          ].dateTime;
        const _date3 =
          warrenpointTideDataRes.data.data.tidalEventList[
            Number.parseInt(event) + 2
          ].dateTime;
        const _date4 =
          warrenpointTideDataRes.data.data.tidalEventList[
            Number.parseInt(event) + 3
          ].dateTime;
        let _dateObj1;
        let _dateObj2;
        let _dateObj3;
        let _dateObj4;
        if (timezoneLoaded === "en-GB") {
          _dateObj1 = new Date(new Date(_date1).getTime() + 3600000);
          _dateObj2 = new Date(new Date(_date2).getTime() + 3600000);
          _dateObj3 = new Date(new Date(_date3).getTime() + 3600000);
          _dateObj4 = new Date(new Date(_date4).getTime() + 3600000);
        } else {
          _dateObj1 = new Date(_date1);
          _dateObj2 = new Date(_date2);
          _dateObj3 = new Date(_date3);
          _dateObj4 = new Date(_date4);
        }
        //first major event that will happen
        setDisplayDataWarrenpoint({
          ...displayDataWarrenpoint,
          warrenpointTides: [
            {
              time:
                _dateObj1.getFullYear() +
                "-" +
                (_dateObj1.getMonth() > 8
                  ? _dateObj1.getMonth() + 1
                  : "0" + (_dateObj1.getMonth() + 1)) +
                "-" +
                (_dateObj1.getDate() > 9
                  ? _dateObj1.getDate()
                  : "0" + _dateObj1.getDate()) +
                " " +
                (_dateObj1.getHours() > 9
                  ? _dateObj1.getHours()
                  : "0" + _dateObj1.getHours()) +
                "" +
                (_dateObj1.getMinutes() > 9
                  ? _dateObj1.getMinutes()
                  : "0" + _dateObj1.getMinutes()),
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].height,
            },
            {
              time:
                _dateObj2.getFullYear() +
                "-" +
                (_dateObj2.getMonth() > 8
                  ? _dateObj2.getMonth() + 1
                  : "0" + (_dateObj2.getMonth() + 1)) +
                "-" +
                (_dateObj2.getDate() > 9
                  ? _dateObj2.getDate()
                  : "0" + _dateObj2.getDate()) +
                " " +
                (_dateObj2.getHours() > 9
                  ? _dateObj2.getHours()
                  : "0" + _dateObj2.getHours()) +
                "" +
                (_dateObj2.getMinutes() > 9
                  ? _dateObj2.getMinutes()
                  : "0" + _dateObj2.getMinutes()),
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].height,
            },
            {
              time:
                _dateObj3.getFullYear() +
                "-" +
                (_dateObj3.getMonth() > 8
                  ? _dateObj3.getMonth() + 1
                  : "0" + (_dateObj3.getMonth() + 1)) +
                "-" +
                (_dateObj3.getDate() > 9
                  ? _dateObj3.getDate()
                  : "0" + _dateObj3.getDate()) +
                " " +
                (_dateObj3.getHours() > 9
                  ? _dateObj3.getHours()
                  : "0" + _dateObj3.getHours()) +
                "" +
                (_dateObj3.getMinutes() > 9
                  ? _dateObj3.getMinutes()
                  : "0" + _dateObj3.getMinutes()),
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].height,
            },
            {
              time:
                _dateObj4.getFullYear() +
                "-" +
                (_dateObj4.getMonth() > 8
                  ? _dateObj4.getMonth() + 1
                  : "0" + (_dateObj4.getMonth() + 1)) +
                "-" +
                (_dateObj4.getDate() > 9
                  ? _dateObj4.getDate()
                  : "0" + _dateObj4.getDate()) +
                " " +
                (_dateObj4.getHours() > 9
                  ? _dateObj4.getHours()
                  : "0" + _dateObj4.getHours()) +
                "" +
                (_dateObj4.getMinutes() > 9
                  ? _dateObj4.getMinutes()
                  : "0" + _dateObj4.getMinutes()),
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].height,
            },
          ],
        });
        break;
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className="h1">Oceanlorry Weather 🌊🚚</div>
      <div className="h4">
        All data provided with good faith but without guarantee.
      </div>
      <div className="h4">Last fetch: {lastFetch}</div>
      <div className={styles.dividerStrong}></div>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={index === currentTab ? styles.tabActive : styles.tab}
            onClick={() => {
              setCurrentTab(index);
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className={styles.dividerStrong}></div>
      {/* home */}
      {currentTab === 0 && (
        <>
          <Tide />
        </>
      )}
      {currentTab === 1 && (
        <>
          <Wind />
        </>
      )}
      {currentTab === 2 && (
        <>
          <Sea />
        </>
      )}
      {currentTab === 3 && (
        <>
          <Weather />
        </>
      )}
      {currentTab === 4 && (
        <>
          <Settings
            toggleAutofetch={toggleAutofetch}
            toggleTimezone={toggleTimezone}
          />
        </>
      )}
    </div>
  );
}

export default App;
