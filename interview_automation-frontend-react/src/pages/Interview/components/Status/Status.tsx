import React, { useMemo } from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import { InterviewStatuses } from '../../../../models/profile/IInterview';
import styles from './Status.module.scss';

function Status():React.JSX.Element{
  const { status:interviewStatus }= useAppSelector((state) => state.interview);
  const StatusText: Partial<Record<InterviewStatuses, string>> = useMemo(() => ({
    PLANNED: 'неактивно',
    ACTIVE: 'активна',
    FINISHED: 'завершена',
    COMPLETED: 'пройдена'
  }), []);

  const bgPointColor: Partial<Record<InterviewStatuses, string>> = useMemo(() => ({
    PLANNED: 'rgb(15 23 41 / 20%)',
    ACTIVE: 'green',
    FINISHED: '#8380b6',
    COMPLETED: '#574997'
  }), []);

  return (
    <div className={styles.status}>
      <div style={{ background:`${bgPointColor[interviewStatus]}` }}/>
      <p>{StatusText[interviewStatus]}</p>
    </div>
  );
}

export default Status;
