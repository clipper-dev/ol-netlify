import React from "react";
import styles from "./TideHourly.module.css";
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';
import {useOutside} from '../../utils/hooks';

function TideHourly({ port, data, actualHeight, movement, close }) {
  const containerRef = React.useRef(null);
  useOutside(containerRef, close);
  return (
    <div className={styles.main}>
      <div className={styles.container} ref={containerRef}>
        <div
          className="h3 cursorPointer"
          onClick={() => {
            close();
          }}
        >
          Close
        </div>
        <div className="h2 bold">{port}</div>
        <div className={styles.tideItem}>
          <div className="h3">Now: {actualHeight}</div>
          <div className="h3 bold">{movement}</div>
        </div>
        {data.map((tide, index) => {
          return(<div className={styles.tideItem} key={index}>
            <div className="h3">{tide.time}</div>
            <div className="h3 flex">{tide.height} {" "} {tide.movement > 0 ? <FaArrowUp/> : <FaArrowDown/>}</div>
          </div>)
        })}
      </div>
    </div>
  );
}

export default TideHourly;
