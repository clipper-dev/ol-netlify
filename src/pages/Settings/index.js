import React from "react";
import { useRecoilState } from "recoil";
import { autoFetchState, timezoneValueState } from "../../atoms/fetchAtom";
import styles from "../../styles/Home.module.css";

function Settings({ toggleTimezone, toggleAutofetch}) {
  const [timezoneValue, setTimezoneValue] = useRecoilState(timezoneValueState);
  const [autoFetch, setAutofetch] = useRecoilState(autoFetchState);
  
  return (
    <>
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
                  ? [styles["toggle-inner"], styles["toggle-inner-left"]].join(
                      " "
                    )
                  : [styles["toggle-inner"], styles["toggle-inner-right"]].join(
                      " "
                    )
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
      <>
        {/* choose time zone */}
        <div className="h2">Auto refresh: {autoFetch ? "On" : "Off"}</div>
        <div className={styles.tideItem}>
          <span>Toggle auto refresh: </span>
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
          <div
            className={styles["toggle-outer"]}
            onClick={() => {
              toggleAutofetch(!autoFetch);
            }}
          >
            <div
              className={
                !autoFetch
                  ? [styles["toggle-inner"], styles["toggle-inner-left"]].join(
                      " "
                    )
                  : [styles["toggle-inner"], styles["toggle-inner-right"]].join(
                      " "
                    )
              }
            >
              <span className={styles["toggle-text"]}>On</span>
              <span className={styles["toggle-text"]}>Off</span>
              <div
                className={
                  !autoFetch
                    ? [styles["handle"], styles["handle-left"]].join(" ")
                    : [styles["handle"], styles["handle-right"]].join(" ")
                }
              />
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default Settings;
