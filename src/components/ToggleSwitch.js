import React from 'react'
import styles from "./ToggleSwitch.module.css"

function ToggleSwitch(props) {
  return (
	<div className={styles["toggle-switch"]}>
        <input
          type="checkbox"
          className={styles["toggle-switch-checkbox"]}
          name={props.name}
          id={props.name}
        />
        <label className={styles["toggle-switch-label"]} htmlFor={props.name}>
          <span className={styles["toggle-switch-inner"]}>UTC</span>
          <span className={styles["toggle-switch-switch"]}>BST</span>
        </label>
      </div>
  )
}

export default ToggleSwitch