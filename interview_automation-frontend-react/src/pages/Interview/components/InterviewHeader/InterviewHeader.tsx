import React from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import Timer from '../Timer/Timer';
import styles from './InterviewHeader.module.scss';

function InterviewHeader():React.JSX.Element {
  const { status:interviewStatus }= useAppSelector((state) => state.interview);

  return (
    <div className={styles.header}>
      <div className={styles.headerBlock1}>
        {interviewStatus !== 'COMPLETED' && <Timer/>}
      </div>
    </div>
  );
}

export default InterviewHeader;
