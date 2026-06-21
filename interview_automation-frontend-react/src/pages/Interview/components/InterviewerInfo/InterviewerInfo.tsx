import React from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import styles from './InterviewerInfo.module.scss';

function InterviewerInfo():React.JSX.Element{
  const { firstname,lastname } = useAppSelector((state) => state.interview.interviewer);

  return (
    <section>
      <h3 className={styles.header}>Інтерв’юєр: {firstname} {lastname}</h3>
    </section>
  );
}
export default InterviewerInfo;
