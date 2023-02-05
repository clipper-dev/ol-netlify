import React from "react";
import {
  FaArrowUp,
  FaLongArrowAltDown,
  FaLongArrowAltRight,
  FaLongArrowAltUp,
} from "react-icons/fa";
import styles from "./TideHourlyItem.module.css";

export default function TideHourlyItem({ tide }) {
  function arrowMovement(movement) {
    if (movement > 2) {
      return (
        <span>
          <FaLongArrowAltUp className="lime" />
          <FaLongArrowAltUp className="lime" />
          <FaLongArrowAltUp className="lime" />
        </span>
      );
    } else if (movement > 1) {
      return (
        <span>
          <FaLongArrowAltUp className="lime" />
          <FaLongArrowAltUp className="lime" />
        </span>
      );
    } else if (movement > 0.2) {
      return (
        <span>
          <FaLongArrowAltUp className="lime" />
        </span>
      );
    } else if (movement > -0.2) {
      return <FaLongArrowAltRight className="gray" />;
    } else if (movement > -1) {
      return <FaLongArrowAltDown className="tomato" />;
    } else if (movement > -2) {
      return (
        <span>
          <FaLongArrowAltDown className="tomato" />
          <FaLongArrowAltDown className="tomato" />
        </span>
      );
    } else {
      return (
        <span>
          <FaLongArrowAltDown className="tomato" />
          <FaLongArrowAltDown className="tomato" />
          <FaLongArrowAltDown className="tomato" />
        </span>
      );
    }
  }
  return (
    <article className={styles.container}>
      <span className={styles.date}> {tide.date}</span>
      <span className={styles.time}> {tide.time}</span>
      <span className={styles.height}>{tide.height} m</span>
      <span className={styles.movement}>{arrowMovement(tide.movement)}</span>
    </article>
  );
}
