import React from 'react'
import styles from './Skeleton.module.css'
function Skeleton() {
  return (
	<div className={styles.tideItem}>
		<div className={styles.filler}/>
	</div>
  )
}

export default Skeleton