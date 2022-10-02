import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import LoadingScreen from "./components/LoadingScreen";
import styles from "./styles/Home.module.css";
/* nav functions */
import { windDegreesToName } from "./utils/nav";

function App() {
  /* app settings */
  const [timezoneValue, setTimezoneValue] = useState("UTC");
  /* state variables */
  const [heyshamTideData, setHeyshamTideData] = useState({});
  const [warrenpointTideData, setWarrenpointTideData] = useState({});
  const [heyshamWindData, setHeyshamWindData] = useState({});
  const [warrenpointWindData, setWarrenpointWindData] = useState({});
  const [loaded, setLoaded] = useState(false);

  const [displayData, setDisplayData] = useState({});
  const [currentHeysham, setCurrentHeysham] = useState({});
  const [currentWarrenpoint, setCurrentWarrenpoint] = useState({});
  /* fetch data */
  const fetchData = async () => {
    /* fetching tide data */
    /* heysham */
    const heyshamTideDataRes = await axios.get("/.netlify/functions/heysham");
    /* warrenpoint */
    const warrenpointTideDataRes = await axios.get(
      "/.netlify/functions/warrenpoint"
    );
    /* weather */
    const warrenpointWindRes = await axios.get(
      "/.netlify/functions/stwWarrenpoint"
    );
    const heyshamWindRes = await axios.get("/.netlify/functions/stwHeysham");

    /* setting the state variables */
    setHeyshamTideData(heyshamTideDataRes.data.data);
    setWarrenpointTideData(warrenpointTideDataRes.data.data);
    setHeyshamWindData(heyshamWindRes.data.data);
    setWarrenpointWindData(warrenpointWindRes.data.data);
    /* update the UI */

    /* manage heysham data */
    //2022-09-25T05:19:00
    const currentDate = new Date();
    console.log(currentDate);
    let _displayData;
    for (const event in heyshamTideDataRes.data.data.tidalEventList) {
      const _date = heyshamTideDataRes.data.data.tidalEventList[event].dateTime;
      /* compare currentDate and _date and check which is later */
      const _dateObj = new Date(_date);
      if (_dateObj > currentDate) {
        //first major event that will happen
        const _date1 = heyshamTideDataRes.data.data.tidalEventList[Number.parseInt(event)].dateTime;
        const _date2 = heyshamTideDataRes.data.data.tidalEventList[Number.parseInt(event)+1].dateTime;
        const _date3 = heyshamTideDataRes.data.data.tidalEventList[Number.parseInt(event)+2].dateTime;
        const _date4 = heyshamTideDataRes.data.data.tidalEventList[Number.parseInt(event)+3].dateTime;
        let _dateObj1;
        let _dateObj2;
        let _dateObj3;
        let _dateObj4;
        if(timezoneValue==="UTC"){
          _dateObj1 = new Date(_date1);
          _dateObj2 = new Date(_date2);
          _dateObj3 = new Date(_date3);
          _dateObj4 = new Date(_date4);
        }
        if(timezoneValue==="en-GB"){
          _dateObj1 = new Date(_date1).toLocaleString("en-GB");
          _dateObj2 = new Date(_date2).toLocaleString("en-GB");
          _dateObj3 = new Date(_date3).toLocaleString("en-GB");
          _dateObj4 = new Date(_date4).toLocaleString("en-GB");
        }
        _displayData = {
          ...displayData,
          heyshamTides: [
            {
              time:
                _dateObj1,
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].height,
            },
            {
              time:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].dateTime.split("T")[0] +
                " " +
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].dateTime
                  .split("T")[1]
                  .split(":")[0] +
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].dateTime
                  .split("T")[1]
                  .split(":")[1],
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].height,
            },
            {
              time:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].dateTime.split("T")[0] +
                " " +
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].dateTime
                  .split("T")[1]
                  .split(":")[0] +
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].dateTime
                  .split("T")[1]
                  .split(":")[1],
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].height,
            },
            {
              time:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].dateTime.split("T")[0] +
                " " +
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].dateTime
                  .split("T")[1]
                  .split(":")[0] +
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].dateTime
                  .split("T")[1]
                  .split(":")[1],
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].height,
            },
          ],
        };
        setDisplayData(_displayData);
        console.log("loaded display data: ", _displayData);
        console.log(_displayData.heyshamTides[0].time);
        break;
      }
    }
    for (const event in warrenpointTideDataRes.data.data.tidalEventList) {
      const _date =
        warrenpointTideDataRes.data.data.tidalEventList[event].dateTime;
      /* compare currentDate and _date and check which is later */
      const _dateObj = new Date(_date);
      if (_dateObj > currentDate) {
        //first major event that will happen
        setDisplayData({
          ..._displayData,
          warrenpointTides: [
            {
              time:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].dateTime.split("T")[0] +
                " " +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].dateTime
                  .split("T")[1]
                  .split(":")[0] +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].dateTime
                  .split("T")[1]
                  .split(":")[1],
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].height,
            },
            {
              time:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].dateTime.split("T")[0] +
                " " +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].dateTime
                  .split("T")[1]
                  .split(":")[0] +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].dateTime
                  .split("T")[1]
                  .split(":")[1],
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].height,
            },
            {
              time:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].dateTime.split("T")[0] +
                " " +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].dateTime
                  .split("T")[1]
                  .split(":")[0] +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].dateTime
                  .split("T")[1]
                  .split(":")[1],
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].height,
            },
            {
              time:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].dateTime.split("T")[0] +
                " " +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].dateTime
                  .split("T")[1]
                  .split(":")[0] +
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].dateTime
                  .split("T")[1]
                  .split(":")[1],
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 3
                ].height,
            },
          ],
        });
        setLoaded(true);
        break;
      }
    }
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

    console.log("heyshamTideData", heyshamTideDataRes.data.data);
    console.log("warrenpointTideData", warrenpointTideDataRes.data.data);
    console.log("heyshamWind", heyshamWindRes.data.data);
    console.log("warrenpointWind", warrenpointWindRes.data.data);
  };
  /* fetching with use effect */
  useEffect(() => {
    const timezoneLoaded = localStorage.getItem("timezone") ?? 0;
    setTimezone(timezoneLoaded);
    fetchData();
  }, []);
  const setTimezone = (timezone) => {
    try {
      setTimezoneValue(Number.parseInt(timezone));
    } catch (error) {
      console.error("Error getting time zone. Switched to UTC.");
      setTimezone("UTC");
    }
  }
  const manageData = () => {};

  return (
    <div className={styles.container}>
      <div className="h1">Oceanlorry Weather 🌊🚚</div>
      <div className="h4">
        All data provided with good faith but without guarantee.
      </div>
      <div className={styles.dividerStrong}></div>
      {/* tides */}
      {loaded && (
        <>
          <div className="h2 bold">Tides 🏊‍♂️</div>
          <div className="h2">Heysham</div>
          {/* tide - now */}
          <div className={styles.tideItem}>
            <div className="h3">{loaded ? "Now" : "tttt"}</div>
            <div className="h3">
              {loaded
                ? Math.round(100 * currentHeysham.height) / 100 + " m, "
                : "nnnn"}
            </div>
            <div className="h3">
              {loaded ? currentHeysham.tideState : "nnnn"}
            </div>
          </div>
          {/* tide - 0 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.heyshamTides[0].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.heyshamTides[0].height) / 100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          {/* tide - 1 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.heyshamTides[1].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.heyshamTides[1].height) / 100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          {/* tide - 2 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.heyshamTides[2].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.heyshamTides[2].height) / 100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          {/* tide - 3 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.heyshamTides[3].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.heyshamTides[3].height) / 100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          <div className="h2">Warrenpoint</div>
          {/* tide - now */}
          <div className={styles.tideItem}>
            <div className="h3">{loaded ? "Now" : "tttt"}</div>
            <div className="h3">
              {loaded
                ? Math.round(100 * currentWarrenpoint.height) / 100 + " m, "
                : "nnnn"}
            </div>
            <div className="h3">
              {loaded ? currentWarrenpoint.tideState : "nnnn"}
            </div>
          </div>
          {/* tide - 0 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.warrenpointTides[0].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.warrenpointTides[0].height) /
                    100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          {/* tide - 1 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.warrenpointTides[1].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.warrenpointTides[1].height) /
                    100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          {/* tide - 2 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.warrenpointTides[2].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.warrenpointTides[2].height) /
                    100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          {/* tide - 3 */}
          <div className={styles.tideItem}>
            <div className="h3">
              {loaded ? displayData.warrenpointTides[3].time : "tttt"}
            </div>
            <div className="h3">
              {loaded
                ? Math.round(100 * displayData.warrenpointTides[3].height) /
                    100 +
                  " m"
                : "nnnn"}
            </div>
          </div>
          <div className={styles.divider}></div>
          {/* wind */}
          <div className="h2 bold">Wind 💨</div>
          <div className="h2">Heysham</div>
          <div className={styles.tideItem}>
            <div className="h3">Average</div>
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
            <div className="h3">Max</div>
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
          <div className="h2">Warrenpoint</div>
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
          <div className={styles.divider}></div>
          {/* settings section */}
          <div className="h2 bold">Settings</div>
          {/* choose time zone */}
          <div className="h2">Time zone</div>
          <div className={styles.tideItem}>
            <select
              onChange={(e) => {
                setTimezone(e.target.value);
              }}
            >
              <option value="UTC">UTC</option>
              <option value="en-GB">BST</option>
            </select>
          </div>
          <div className={styles.divider}></div>
          <div className="h4">2022, all rights reserved.</div>
        </>
      )}
      {!loaded && (
        <div className={styles.loading}>
          <LoadingScreen />
        </div>
      )}
    </div>
  );
}

export default App;
