import React from 'react';

import styles from '../../InterviewItemRow.module.scss';

function FeedbackButton() :React.JSX.Element {
  return (
    <button className={styles.tableButton} type="button">
      відгук
      <span className={styles.cancelIcon}/>
    </button>
  );
}

export default FeedbackButton;
