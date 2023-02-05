import React from "react";
import { FaLock } from "react-icons/fa";
import styles from "./Purchase.module.css";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

export default function Purchase() {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <FaLock /> Locked
      </div>
      <div className={styles.button} onClick={() => {
                  confetti();
                }}>Unlock - 5$</div>
    </div>
  );
}
