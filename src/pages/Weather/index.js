import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { lastFetchState, loadedState, skeletonState } from "../../atoms/fetchAtom";
import {
  metofficeDataState,
  showMetofficeState,
} from "../../atoms/metofficeAtom";
import Skeleton from "../../components/Skeleton";
import styles from "../../styles/Home.module.css";

function Weather() {
  /* loading state */
  const [loaded, setLoaded] = useRecoilState(loadedState);
  const [skeleton, setSkeleton] = useRecoilState(skeletonState);
  const [lastFetch, setLastFetch] = useRecoilState(lastFetchState);

  const [showMetoffice, setShowMetoffice] = useRecoilState(showMetofficeState);
  const [metofficeData, setMetofficeData] = useRecoilState(metofficeDataState);
  return (
    <>
      {/* metoffice weather section */}
      <div className="h2 bold">Weather forecast 🔆</div>

      {skeleton &&
        (showMetoffice ? (
          metofficeData[0].gale && (
            <>
              <div className="bold">{metofficeData[5]}</div>
              <div className="h2">Gale warning</div>

              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded ? metofficeData[0].issueTime : "tttt"}
                </div>
              </div>
              <div className={styles.tideItem}>
                <div className="h3">
                  {loaded ? metofficeData[0].galeText : "No gale warning"}
                </div>
              </div>
            </>
          )
        ) : (
          <h2>Failed to load gale forecast.</h2>
        ))}
      {/* one sections of skeleton animation */}
      {!skeleton && (
        <>
          <Skeleton />
        </>
      )}
      {skeleton &&
        (showMetoffice ? (
          <>
            <div className="h2">Wind</div>
            <div className={styles.tideItem}>
              <div className="h3">{loaded ? metofficeData[1] : "tttt"}</div>
            </div>
            <div className="h2">Sea</div>
            <div className={styles.tideItem}>
              <div className="h3">{loaded ? metofficeData[2] : "tttt"}</div>
            </div>
            <div className="h2">Weather</div>
            <div className={styles.tideItem}>
              <div className="h3">{loaded ? metofficeData[3] : "tttt"}</div>
            </div>
            <div className="h2">Visibility</div>
            <div className={styles.tideItem}>
              <div className="h3">{loaded ? metofficeData[4] : "tttt"}</div>
            </div>
          </>
        ) : (
          <h2>Failed to load weather forecast.</h2>
        ))}
      {/* one sections of skeleton animation */}
      {!skeleton && (
        <>
          <div className="h2">Wind</div>
          <Skeleton />
          <div className="h2">Sea</div>
          <Skeleton />
          <div className="h2">Weather</div>
          <Skeleton />
          <div className="h2">Visibility</div>
          <Skeleton />
        </>
      )}
    </>
  );
}

export default Weather;
