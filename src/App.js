import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import LoadingScreen from "./components/LoadingScreen";
import Skeleton from "./components/Skeleton";
import ToggleSwitch from "./components/ToggleSwitch";
import styles from "./styles/Home.module.css";
/* nav functions */
import { heyshamTidalCurrent, windDegreesToName } from "./utils/nav";

function App() {
  /* app settings */
  const [timezoneValue, setTimezoneValue] = useState("UTC");
  /* state variables */
  const [heyshamTideData, setHeyshamTideData] = useState({});
  const [warrenpointTideData, setWarrenpointTideData] = useState({});
  const [heyshamWindData, setHeyshamWindData] = useState({});
  const [heyshamWindPartnerData, setHeyshamWindPartnerData] = useState({});
  const [heyshamWindPeelsData, setHeyshamWindPeelsData] = useState({});
  const [warrenpointWindData, setWarrenpointWindData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [skeleton, setSkeleton] = useState(false);

  const [displayDataHeysham, setDisplayDataHeysham] = useState({});
  const [displayDataWarrenpoint, setDisplayDataWarrenpoint] = useState({});
  const [currentHeysham, setCurrentHeysham] = useState({});
  const [tidalCurrentHeyshamNow, setTidalCurrentHeyshamNow] = useState({});

  const [currentWarrenpoint, setCurrentWarrenpoint] = useState({});
  const [errorPopup, setErrorPopup] = useState(false);
  /* fetch data */
  const fetchData = async () => {
    /* fetching tide data */
    /* heysham */
    const heyshamTideDataRes = await axios
      .get("/.netlify/functions/heysham")
      .catch((err) => {
        setErrorPopup(true);
      });
    /* warrenpoint */
    const warrenpointTideDataRes = await axios
      .get("/.netlify/functions/warrenpoint")
      .catch((err) => {
        setErrorPopup(true);
      });
    /* liverpool */
    /* const liverpoolTideDataRes = await axios.get(
      "/.netlify/functions/liverpool"
    ).catch((err)=>{
      setErrorPopup(true);
    }); */
    /* weather */
    const warrenpointWindRes = await axios
      .get("/.netlify/functions/stwWarrenpoint")
      .catch((err) => {
        setErrorPopup(true);
      });
    const heyshamWindRes = await axios
      .get("/.netlify/functions/stwHeysham")
      .catch((err) => {
        setErrorPopup(true);
      });

    /* partner wind */

    const partnerWindData = await axios
      .get("/.netlify/functions/partner")
      .catch((err) => {
        setErrorPopup(true);
      });
    let parser = new DOMParser();
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
    console.log("partner", texts);

    /* peels WX data */

    const peelsData = await axios
      .get("/.netlify/functions/peels")
      .catch((err) => {
        setErrorPopup(true);
      });
    let htmlPeels = parser.parseFromString(peelsData.data, "text/html");

    // Find all elements with the specified attribute
    let peels = [];
    peels.push(htmlPeels.querySelectorAll('[Parameter="10003"]')[0].textContent);//observed
    peels.push(htmlPeels.querySelectorAll('[Parameter="10004"]')[0].textContent);//predicted
    peels.push(htmlPeels.querySelectorAll('[Parameter="10005"]')[0].textContent);//surge, basciacally obs-pred
    peels.push(htmlPeels.querySelectorAll('[Parameter="50003"]')[0].textContent);//wind direction
    peels.push(htmlPeels.querySelectorAll('[Parameter="50002"]')[0].textContent);//wind speed
    peels.push(htmlPeels.querySelectorAll('[Parameter="50007"]')[0].textContent);//gust direction
    peels.push(htmlPeels.querySelectorAll('[Parameter="50006"]')[0].textContent);//gust speed

    console.log(peels);

    /* setting the state variables */
    setHeyshamTideData(heyshamTideDataRes);
    setWarrenpointTideData(warrenpointTideDataRes);
    setHeyshamWindData(heyshamWindRes.data.data);
    setWarrenpointWindData(warrenpointWindRes.data.data);
    setHeyshamWindPartnerData(texts);
    setHeyshamWindPeelsData(peels);
    /* update the UI */

    /* manage heysham data */
    //2022-09-25T05:19:00
    /* const currentDate = new Date(); */
    let currentDate = new Date();
    console.log("current date and time", currentDate);
    updateTimezoneHeysham(heyshamTideDataRes);
    console.log("heysham data", heyshamTideDataRes);
    updateTimezoneWarrenpoint(warrenpointTideDataRes);
    //
    /* setting the current tide height and checking whether it's flood or ebb */
    //tidalHeightOccurrenceList
    //heysham
    for (const event in heyshamTideDataRes.data.data
      .tidalHeightOccurrenceList) {
      const _date =
        heyshamTideDataRes.data.data.tidalHeightOccurrenceList[event].dateTime;

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
    //warrenpoint
    for (const event in warrenpointTideDataRes.data.data
      .tidalHeightOccurrenceList) {
      const _date =
        warrenpointTideDataRes.data.data.tidalHeightOccurrenceList[event]
          .dateTime;
      /* compare currentDate and _date and check which is later */
      const _dateObj = new Date(_date);
      if (_dateObj > currentDate) {
        console.log("warrentpoint time", _dateObj);
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

    /* checking the closes high water in heysham and calculating the tidal current in heysham */
    for (const event in heyshamTideDataRes.data.data.tidalEventList) {
      const _date = heyshamTideDataRes.data.data.tidalEventList[event].dateTime;
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
        const _dateObj2 = new Date(_date2);
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
        );

        /* check which local extremum is the high water - the one before now or after */
        if (tideAfter - tideBefore > 0) {
          /* tide after is the closer high water */
          const timeDifference = _dateObj - currentDate;
          const hoursToHW = timeDifference / 3600000;
          const [currentHeight, currentDirection] = heyshamTidalCurrent(
            hoursToHW,
            range
          );
          console.log(hoursToHW, range);

          setTidalCurrentHeyshamNow({
            height: currentHeight,
            direction: currentDirection,
          });
        } else {
          const timeDifference = _dateObj2 - currentDate;
          const hoursToHW = timeDifference / 3600000;
          console.log(hoursToHW, range);
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

    /* set loaded flag to true because all the data should be already fetched */
    setLoaded(true);
    setSkeleton(true);
  };
  /* refs */
  const timezoneSelect = useRef(null);
  /* fetching with use effect */
  useEffect(() => {
    const timezoneLoaded = localStorage.getItem("timezone") ?? 0;
    setTimezone(timezoneLoaded);
    fetchData();
  }, []);

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
                (_dateObj1.getDate() > 9
                  ? _dateObj1.getDate()
                  : "0" + _dateObj1.getDate()) +
                "-" +
                (_dateObj1.getMonth() + 1) +
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
                (_dateObj2.getDate() > 9
                  ? _dateObj2.getDate()
                  : "0" + _dateObj2.getDate()) +
                "-" +
                (_dateObj2.getMonth() > 8
                  ? _dateObj2.getMonth() + 1
                  : "0" + (_dateObj2.getMonth() + 1)) +
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
                (_dateObj3.getDate() > 9
                  ? _dateObj3.getDate()
                  : "0" + _dateObj3.getDate()) +
                "-" +
                (_dateObj3.getMonth() > 8
                  ? _dateObj3.getMonth() + 1
                  : "0" + (_dateObj3.getMonth() + 1)) +
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
                (_dateObj4.getDate() > 9
                  ? _dateObj4.getDate()
                  : "0" + _dateObj4.getDate()) +
                "-" +
                (_dateObj4.getMonth() > 8
                  ? _dateObj4.getMonth() + 1
                  : "0" + (_dateObj4.getMonth() + 1)) +
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
                (_dateObj1.getDate() > 9
                  ? _dateObj1.getDate()
                  : "0" + _dateObj1.getDate()) +
                "-" +
                (_dateObj1.getMonth() > 8
                  ? _dateObj1.getMonth() + 1
                  : "0" + (_dateObj1.getMonth() + 1)) +
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
                (_dateObj2.getDate() > 9
                  ? _dateObj2.getDate()
                  : "0" + _dateObj2.getDate()) +
                "-" +
                (_dateObj2.getMonth() > 8
                  ? _dateObj2.getMonth() + 1
                  : "0" + (_dateObj2.getMonth() + 1)) +
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
                (_dateObj3.getDate() > 9
                  ? _dateObj3.getDate()
                  : "0" + _dateObj3.getDate()) +
                "-" +
                (_dateObj3.getMonth() > 8
                  ? _dateObj3.getMonth() + 1
                  : "0" + (_dateObj3.getMonth() + 1)) +
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
                (_dateObj4.getDate() > 9
                  ? _dateObj4.getDate()
                  : "0" + _dateObj4.getDate()) +
                "-" +
                (_dateObj3.getMonth() > 8
                  ? _dateObj3.getMonth() + 1
                  : "0" + (_dateObj4.getMonth() + 1)) +
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
      <div className={styles.dividerStrong}></div>
      <>
        {/* tides */}
        <>
          <div className="h2 bold">Tides 🏊‍♂️</div>
          <div className="h2">Heysham</div>
          {/* heysham tides */}
          {skeleton && (
            <>
              {/* tide - now */}
              <div className={styles.tideItem}>
                <div className="h3">{loaded ? "Observed" : "tttt"}</div>
                <div className="h3">
                  {loaded ? heyshamWindPeelsData[0]  + " m, " : "nnnn"}
                </div>
                <div className="h3 bold">
                  {loaded ? currentHeysham.tideState : "nnnn"}
                </div>
              </div>
              <div className={styles.tideItem}>
                <div className="h3">{loaded ? "Surge" : "tttt"}</div>
                <div className="h3">
                  {loaded ? heyshamWindPeelsData[2]  + " m" : "nnnn"}
                </div>
              </div>
              <div className={styles.tideItem}>
                <div className="h3">{loaded ? "Prediction" : "tttt"}</div>
                <div className="h3">
                  {loaded
                    ? heyshamWindPeelsData[1] + " m"
                    : "nnnn"}
                </div>
              </div>
              {/* tide - 0 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded ? displayDataHeysham.heyshamTides[0].time : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataHeysham.heyshamTides[0].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
              {/* tide - 1 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded ? displayDataHeysham.heyshamTides[1].time : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataHeysham.heyshamTides[1].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
              {/* tide - 2 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded ? displayDataHeysham.heyshamTides[2].time : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataHeysham.heyshamTides[2].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
              {/* tide - 3 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded ? displayDataHeysham.heyshamTides[3].time : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataHeysham.heyshamTides[3].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
            </>
          )}
          {/* five sections of skeleton animation */}
          {!skeleton && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
          <div className="h2">Warrenpoint</div>
          {skeleton && (
            <>
              {/* tide - now */}
              <div className={styles.tideItem}>
                <div className="h3">{loaded ? "Now" : "tttt"}</div>
                <div className="h3">
                  {loaded
                    ? Math.round(100 * currentWarrenpoint.height) / 100 + " m, "
                    : "nnnn"}
                </div>
                <div className="h3 bold">
                  {loaded ? currentWarrenpoint.tideState : "nnnn"}
                </div>
              </div>
              {/* tide - 0 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded
                    ? displayDataWarrenpoint.warrenpointTides[0].time
                    : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataWarrenpoint.warrenpointTides[0].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
              {/* tide - 1 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded
                    ? displayDataWarrenpoint.warrenpointTides[1].time
                    : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataWarrenpoint.warrenpointTides[1].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
              {/* tide - 2 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded
                    ? displayDataWarrenpoint.warrenpointTides[2].time
                    : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataWarrenpoint.warrenpointTides[2].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
              {/* tide - 3 */}
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded
                    ? displayDataWarrenpoint.warrenpointTides[3].time
                    : "tttt"}
                </div>
                <div className="h3">
                  {loaded
                    ? Math.round(
                        100 * displayDataWarrenpoint.warrenpointTides[3].height
                      ) /
                        100 +
                      " m"
                    : "nnnn"}
                </div>
              </div>
            </>
          )}
          {/* five sections of skeleton animation */}
          {!skeleton && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
        </>
        <div className={styles.divider}></div>
        {/* wind */}
        <div className="h2 bold">Wind 💨</div>
        <div className="h2">Heysham</div>
        {skeleton && (
          <>
            <div className={styles.tideItem}>
              <div className="h3">Own</div>
              <div className="h3">
                {loaded ? heyshamWindData.averagewindspeed + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(heyshamWindData.winddirection)
                    )
                  : "nnnn"}
              </div>
            </div>
            <div className={styles.tideItem}>
              <div className="h3">Gust</div>
              <div className="h3">
                {loaded ? heyshamWindData.highwindspeed + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(heyshamWindData.winddirection)
                    )
                  : "nnnn"}
              </div>
            </div>
            <div className={styles.tideItem}>
              <div className="h3">Peels</div>
              <div className="h3">
                {loaded ? heyshamWindPeelsData[4] + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(heyshamWindPeelsData[3])
                    )
                  : "nnnn"}
              </div>
            </div>
            <div className={styles.tideItem}>
              <div className="h3">Gust Peels</div>
              <div className="h3">
                {loaded ? heyshamWindPeelsData[6] + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(heyshamWindPeelsData[5])
                    )
                  : "nnnn"}
              </div>
            </div>
            <div className={styles.tideItem}>
              <div className="h3">Partner</div>
              <div className="h3">
                {loaded ? heyshamWindPartnerData[1] + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(heyshamWindPartnerData[2])
                    )
                  : "nnnn"}
              </div>
            </div>
            <div className={styles.tideItem}>
              <div className="h3">Gust Partner</div>
              <div className="h3">
                {loaded ? heyshamWindPartnerData[0] + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(heyshamWindPartnerData[2])
                    )
                  : "nnnn"}
              </div>
            </div>
          </>
        )}
        {/* two sections of skeleton animation */}
        {!skeleton && (
          <>
            <Skeleton />
            <Skeleton />
          </>
        )}
        <div className="h2">Warrenpoint</div>
        {skeleton && (
          <>
            <div className={styles.tideItem}>
              <div className="h3">Average</div>
              <div className="h3">
                {loaded ? warrenpointWindData.averagewindspeed + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(warrenpointWindData.winddirection)
                    )
                  : "nnnn"}
              </div>
            </div>
            <div className={styles.tideItem}>
              <div className="h3">Max</div>
              <div className="h3">
                {loaded ? warrenpointWindData.highwindspeed + " kn" : "tttt"}
              </div>
              <div className="h3">
                {loaded
                  ? windDegreesToName(
                      Number.parseInt(warrenpointWindData.winddirection)
                    )
                  : "nnnn"}
              </div>
            </div>
          </>
        )}
        {/* two sections of skeleton animation */}
        {!skeleton && (
          <>
            <Skeleton />
            <Skeleton />
          </>
        )}
        <div className={styles.divider}></div>

        {/* currents section */}
        <div className="h2 bold">Current 💦</div>
        {/* choose time zone */}
        <div className="h2">Heysham</div>
        {skeleton && (
          <>
            <div className={styles.tideItem}>
              <div className="h3">Now</div>
              <div className="h3">
                {loaded
                  ? Math.round(10 * tidalCurrentHeyshamNow.height) / 10 + " kn"
                  : "Nan kn"}
              </div>
              <div className="h3">
                {loaded ? tidalCurrentHeyshamNow.direction : "Nan"}
              </div>
            </div>
          </>
        )}
        {/* one sections of skeleton animation */}
        {!skeleton && (
          <>
            <Skeleton />
          </>
        )}
        <div className={styles.divider}></div>

        {/* settings section */}
        <div className="h2 bold">Settings ⚙</div>
        <>
          {/* choose time zone */}

          <div className="h2">
            Time zone: {timezoneValue === "en-GB" ? "UTC+1" : "UTC"}
          </div>
          <div className={styles.tideItem}>
            <span>Change timezone: </span>
            {/* <select
              onChange={(e) => {
                setTimezone(e.target.value);
              }}
              ref={timezoneSelect}
              id="timezoneSelectID"
            >
              <option value=""></option>
              <option value="UTC">UTC</option>
              <option value="en-GB">BST</option>
            </select> */}
            <div className={styles["toggle-outer"]} onClick={toggleTimezone}>
              <div
                className={
                  timezoneValue === "UTC"
                    ? [
                        styles["toggle-inner"],
                        styles["toggle-inner-left"],
                      ].join(" ")
                    : [
                        styles["toggle-inner"],
                        styles["toggle-inner-right"],
                      ].join(" ")
                }
              >
                <span className={styles["toggle-text"]}>UTC+1</span>
                <span className={styles["toggle-text"]}>UTC</span>
                <div
                  className={
                    timezoneValue === "UTC"
                      ? [styles["handle"], styles["handle-left"]].join(" ")
                      : [styles["handle"], styles["handle-right"]].join(" ")
                  }
                />
              </div>
            </div>
          </div>
        </>
        <div className={styles.divider}></div>
        <div className="h4">2022, all rights reserved.</div>
        {/* error popup */}
        {errorPopup && (
          <div className={styles["error-popup"]}>
            <div
              className={styles["error-popup-close"]}
              onClick={() => {
                setErrorPopup(false);
              }}
            >
              Close
            </div>
            <div className={styles["error-popup-text"]}>
              There seems to be a problem with connection.
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default App;
