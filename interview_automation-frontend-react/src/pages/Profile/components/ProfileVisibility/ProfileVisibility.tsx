import React from 'react';

import styles from './ProfileVisibility.module.scss';

function ProfileVisibility():React.JSX.Element {

  return(
    <div className={styles.profileVisibility}>
      <span className={styles.info}/>
      <p>Відкритий профіль</p>
      <label className={styles.switcher}>
        <input type="checkbox"/>
        <span className={styles.slider}/>
      </label>
    </div>
  );
}

export default ProfileVisibility;
