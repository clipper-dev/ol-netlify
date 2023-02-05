import React from "react";
import styles from "./TideHourly.module.css";
import { FaArrowUp, FaArrowDown, FaLongArrowAltRight, FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { useOutside } from "../../utils/hooks";
import TideHourlyItem from "./TideHourlyItem";

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
          return (
            <TideHourlyItem key={index} tide={tide} />
          );
        })}
      </div>
    </div>
  );
}

export default TideHourly;
