import React from "react";
import { useRecoilState } from "recoil";
import {
  lastFetchState,
  loadedState,
  skeletonState,
} from "../../atoms/fetchAtom";
import { currentHeyshamState, currentWarrenpointState, displayDataHeyshamState, displayDataWarrenpointState, heyshamTideDataHourlyState, heyshamTideDataState, showHeyshamHourlyState, showHeyshamTideState, showWarrenpointHourlyState, showWarrenpointTideState, tidalCurrentHeyshamNowState, warrenpointTideDataHourlyState, warrenpointTideDataState } from "../../atoms/tidesAtom";
import { heyshamWindPeelsDataState, showHeyshamWindPeelsState } from "../../atoms/windAtom";
import Skeleton from "../../components/Skeleton";
import TideHourly from "../../components/TideHourly/TideHourly";
import styles from "../../styles/Home.module.css";
function Tide() {
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

  const [showHeyshamHourly, setShowHeyshamHourly] = useRecoilState(showHeyshamHourlyState);
  const [showWarrenpointHourly, setShowWarrenpointHourly] = useRecoilState(showWarrenpointHourlyState);

  const [showHeyshamTide, setShowHeyshamTide] = useRecoilState(showHeyshamTideState);
  const [heyshamTideData, setHeyshamTideData] = useRecoilState(heyshamTideDataState);

  
  const [showWarrenpointTide, setShowWarrenpointTide] = useRecoilState(showWarrenpointTideState);
  const [warrenpointTideData, setWarrenpointTideData] = useRecoilState(warrenpointTideDataState);
  
  const [heyshamTideDataHourly, setHeyshamTideDataHourly] = useRecoilState(heyshamTideDataHourlyState);
  const [warrenpointTideDataHourly, setWarrenpointTideDataHourly] = useRecoilState(
    warrenpointTideDataHourlyState
  );
  const [showHeyshamWindPeels, setShowHeyshamWindPeels] = useRecoilState(
    showHeyshamWindPeelsState
  );
  const [heyshamWindPeelsData, setHeyshamWindPeelsData] = useRecoilState(
    heyshamWindPeelsDataState
  );
  /* functions */
  function closeHeyshamHourly() {
    setShowHeyshamHourly(false);
  }
  function closeWarrenpointHourly() {
    setShowWarrenpointHourly(false);
  }
  return (
    <>
          {/* heysham hourly */}
          {loaded && showHeyshamHourly && (
            <TideHourly
              port={"Heysham"}
              actualHeight={heyshamWindPeelsData[0]}
              movement={currentHeysham.tideState}
              data={heyshamTideDataHourly}
              close={closeHeyshamHourly}
            />
          )}
          {/* warrenpointhourly */}
          {loaded && showWarrenpointHourly && (
            <TideHourly
              port={"Warrenpoint"}
              actualHeight={Math.round(100 * currentWarrenpoint.height) / 100}
              movement={currentWarrenpoint.tideState}
              data={warrenpointTideDataHourly}
              close={closeWarrenpointHourly}
            />
          )}
          {/* tides */}
          <>
            <div className="h2 bold">Tides 🏊‍♂️</div>
            {/* heysham tides */}
            <div
              className="h2"
              onClick={() => {
                setShowHeyshamHourly(true);
              }}
            >
              Heysham
            </div>
            {skeleton &&
              (showHeyshamTide ? (
                <>
                  {/* tide - now */}
                  <div className={styles.tideItem}>
                    <div className="h3 observed">{loaded ? "Now" : "tttt"}</div>
                    <div className="h3">
                      {loaded ? heyshamWindPeelsData[0] + " m, " : "nnnn"}
                    </div>
                    <div className="h3 bold">
                      {loaded ? currentHeysham.tideState : "nnnn"}
                    </div>
                  </div>
                  <div className={styles.tideItem}>
                    <div className="h3">{loaded ? "Surge" : "tttt"}</div>
                    <div className="h3">
                      {loaded ? heyshamWindPeelsData[2] + " m" : "nnnn"}
                    </div>
                  </div>
                  <div className={styles.tideItem}>
                    <div className="h3 prediction">{loaded ? "Now" : "tttt"}</div>
                    <div className="h3">
                      {loaded ? heyshamWindPeelsData[1] + " m" : "nnnn"}
                    </div>
                  </div>
                  {/* tide - 0 */}
                  <div className={styles.tideItem}>
                    <div className="h3">
                      {loaded
                        ? displayDataHeysham.heyshamTides[0].time
                        : "tttt"}
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
                      {loaded
                        ? displayDataHeysham.heyshamTides[1].time
                        : "tttt"}
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
                      {loaded
                        ? displayDataHeysham.heyshamTides[2].time
                        : "tttt"}
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
                      {loaded
                        ? displayDataHeysham.heyshamTides[3].time
                        : "tttt"}
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
              ) : (
                <h2>Failed to load tidal data.</h2>
              ))}
            {!skeleton && (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}

            {/* warrenpoint tides */}
            <div
              className="h2"
              onClick={() => {
                setShowWarrenpointHourly(true);
              }}
            >
              Warrenpoint
            </div>
            {skeleton &&
              (showWarrenpointTide ? (
                <>
                  {/* tide - now */}
                  <div className={styles.tideItem}>
                    <div className="h3 prediction">{loaded ? "Now" : "tttt"}</div>
                    <div className="h3">
                      {loaded
                        ? Math.round(100 * currentWarrenpoint.height) / 100 +
                          " m, "
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
                            100 *
                              displayDataWarrenpoint.warrenpointTides[0].height
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
                            100 *
                              displayDataWarrenpoint.warrenpointTides[1].height
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
                            100 *
                              displayDataWarrenpoint.warrenpointTides[2].height
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
                            100 *
                              displayDataWarrenpoint.warrenpointTides[3].height
                          ) /
                            100 +
                          " m"
                        : "nnnn"}
                    </div>
                  </div>
                </>
              ) : (
                <h2>Failed to load tidal data.</h2>
              ))}
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
        </>
  )
}

export default Tide