import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import styles from "./styles/Home.module.css";

function App() {
  const [liverpoolTideData, setLiverpoolTideData] = useState({});
  const [heyshamTideData, setHeyshamTideData] = useState({});
  const [warrenpointTideData, setWarrenpointTideData] = useState({});
  const [heyshamWindData, setHeyshamWindData] = useState({});
  const [warrenpointWindData, setWarrenpointWindData] = useState({});
  const [loaded, setLoaded] = useState(false);

  const [displayData, setDisplayData] = useState({});
  /* fetch data */
  const fetchData = async () => {
    /* fetching tide data */
    /* heysham */
    const heyshamTideDataRes = await axios.get("/.netlify/functions/heysham");
    /* warrenpoint */
    const warrenpointTideDataRes = await axios.get(
      "/.netlify/functions/warrenpoint"
      );
      /* liverpool */
      const liverpoolTideDataRes = await axios.get("/.netlify/functions/liverpool");
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
    let _displayData;
    for (const event in heyshamTideDataRes.data.data.tidalEventList) {
      const _date = heyshamTideDataRes.data.data.tidalEventList[event].dateTime;
      /* compare currentDate and _date and check which is later */
      const _dateObj = new Date(_date);
      if (_dateObj > currentDate) {
        //first major event that will happen
        _displayData = {
          ...displayData,
          heyshamTides: [
            {
              time: heyshamTideDataRes.data.data.tidalEventList[
                Number.parseInt(event)
              ].dateTime,
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].height,
            },
            {
              time: heyshamTideDataRes.data.data.tidalEventList[
                Number.parseInt(event) + 1
              ].dateTime,
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].height,
            },
            {
              time: heyshamTideDataRes.data.data.tidalEventList[
                Number.parseInt(event) + 2
              ].dateTime,
              height:
                heyshamTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].height,
            },
            {
              time: heyshamTideDataRes.data.data.tidalEventList[
                Number.parseInt(event) + 3
              ].dateTime,
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
      console.log(event);
      console.log(Number.parseInt(event) + 1);
      if (_dateObj > currentDate) {
        //first major event that will happen
        setDisplayData({
          ..._displayData,
          warrenpointTides: [
            {
              time: warrenpointTideDataRes.data.data.tidalEventList[
                Number.parseInt(event)
              ].dateTime,
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event)
                ].height,
            },
            {
              time: warrenpointTideDataRes.data.data.tidalEventList[
                Number.parseInt(event) + 1
              ].dateTime,
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 1
                ].height,
            },
            {
              time: warrenpointTideDataRes.data.data.tidalEventList[
                Number.parseInt(event) + 2
              ].dateTime,
              height:
                warrenpointTideDataRes.data.data.tidalEventList[
                  Number.parseInt(event) + 2
                ].height,
            },
            {
              time: warrenpointTideDataRes.data.data.tidalEventList[
                Number.parseInt(event) + 3
              ].dateTime,
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

    console.log("heyshamTideData", heyshamTideDataRes.data.data);
    console.log("warrenpointTideData", warrenpointTideDataRes.data.data);
    console.log("heyshamWind", heyshamWindRes.data.data);
    console.log("warrenpointWind", warrenpointWindRes.data.data);
  };
  /* fetching with use effect */
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(()=>{
    console.log("true display data",displayData)
    console.log(loaded)
  },[loaded])

  const manageData = () => {};

  return (
    <div className={styles.container}>
      <div className="h1">Oceanlorry Weather 🌊🚚</div>
      <div className={styles.dividerStrong}></div>
      {/* tides */}
      {loaded && (
        <>
          <div className="h2 bold">Tides 🏊‍♂️</div>
          <div className="h2">Heysham</div>
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
              {loaded ? heyshamWindData.winddirection + " deg" : "nnnn"}
            </div>
          </div>
          <div className={styles.tideItem}>
            <div className="h3">Max</div>
            <div className="h3">
                       {loaded ? heyshamWindData.highwindspeed + " kn" : "tttt"}
            </div>
            <div className="h3">
              {loaded ? heyshamWindData.winddirection + " deg" : "nnnn"}
            </div>
          </div>
          <div className="h2">Warrenpoint</div>
          <div className={styles.tideItem}>
            <div className="h3">Average</div>
            <div className="h3">
                       {loaded ? warrenpointWindData.averagewindspeed + " kn" : "tttt"}
            </div>
            <div className="h3">
              {loaded ? warrenpointWindData.winddirection + " deg" : "nnnn"}
            </div>
          </div>
          <div className={styles.tideItem}>
            <div className="h3">Max</div>
            <div className="h3">
                       {loaded ? warrenpointWindData.highwindspeed + " kn" : "tttt"}
            </div>
            <div className="h3">
              {loaded ? warrenpointWindData.winddirection + " deg" : "nnnn"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
