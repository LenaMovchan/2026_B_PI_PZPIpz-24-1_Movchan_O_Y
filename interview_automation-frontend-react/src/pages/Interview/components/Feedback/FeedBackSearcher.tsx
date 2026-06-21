import React from 'react';

import {  useAppSelector } from '../../../../hooks/redux';
import styles from './FeedBack.module.scss';

function FeedBackSearcher(): React.JSX.Element {
  const { feedback }= useAppSelector((state) => state.interview);

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.feedbackSubContainer}>
        <p>{feedback}</p>
      </div>
    </div>
  );
}
export default FeedBackSearcher;
