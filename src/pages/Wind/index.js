import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  lastFetchState,
  loadedState,
  skeletonState,
} from "../../atoms/fetchAtom";
import {
  metofficeDataState,
  showMetofficeState,
} from "../../atoms/metofficeAtom";
import {
  heyshamWindDataState,
  heyshamWindPartnerDataState,
  heyshamWindPeelsDataState,
  showHeyshamWindOwnState,
  showHeyshamWindPartnerState,
  showHeyshamWindPeelsState,
  showWarrenpointWindState,
  warrenpointWindDataState,
} from "../../atoms/windAtom";
import Skeleton from "../../components/Skeleton";
import styles from "../../styles/Home.module.css";
import { windDegreesToName } from "../../utils/nav";

function Wind() {
  /* loading state */
  const [loaded, setLoaded] = useRecoilState(loadedState);
  const [skeleton, setSkeleton] = useRecoilState(skeletonState);
  const [lastFetch, setLastFetch] = useRecoilState(lastFetchState);
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
  return (
    <>
      {/* wind */}
      <div className="h2 bold">Wind 💨</div>
      <div className="h2">Heysham</div>
      {skeleton && (
        <>
          {showHeyshamWindOwn ? (
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
            </>
          ) : (
            <h2>Failed to load own wind data.</h2>
          )}
          {showHeyshamWindPeels ? (
            <>
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
            </>
          ) : (
            <h2>Failed to load peels wind data.</h2>
          )}
          {showHeyshamWindPartner ? (
            <>
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
          ) : (
            <h2>Failed to load partner wind data.</h2>
          )}
        </>
      )}
      {!skeleton && (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      )}
      <div className="h2">Warrenpoint</div>
      {skeleton &&
        (showWarrenpointWindOwn ? (
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
        ) : (
          <h2>Failed to load own wind data.</h2>
        ))}
      {!skeleton && (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}
    </>
  );
}

export default Wind;
