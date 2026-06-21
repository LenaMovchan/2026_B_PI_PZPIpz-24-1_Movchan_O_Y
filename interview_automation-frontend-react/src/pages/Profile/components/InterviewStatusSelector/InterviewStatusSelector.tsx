import React from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import { InterviewStatuses } from '../../../../models/profile/IInterview';
import { getInterviewsByStatus } from '../../../../utils/notification/getTimeToInterview';
import styles from './InterviewStatusSelector.module.scss';

interface  IInterviewStatusSelectorProps{
  onClick :(status:InterviewStatuses)=>void
  status:InterviewStatuses;
}

function InterviewStatusSelector({ onClick,status }:IInterviewStatusSelectorProps):React.JSX.Element {

  const NavText:Record<InterviewStatuses, string> = {
    COMPLETED: 'Пройдені',
    PLANNED: 'Заплановані',
    ACTIVE: 'Незавершені',
    FINISHED: 'Завершені',
    CANCELLED: 'Відмінені',
    '': ' Всі',
  };
  const interviewStatuses:InterviewStatuses[] = [ 'PLANNED', 'ACTIVE','FINISHED','COMPLETED' ];
  const interviews = useAppSelector((state) => state.profile.interviews);
  const handleStatusChange = (newStatus: InterviewStatuses):void => {
    onClick(newStatus);
  };

  return (
    <div className={styles.interviewTypesContainer}>
      {interviewStatuses.map((currentStatus:InterviewStatuses,) => (
        <button
          type="button"
          key={currentStatus}
          onClick={() => handleStatusChange(currentStatus)}
          className={currentStatus === status ? `${styles.activeLink} ${styles.link}` : styles.link}
        >
          <p>{NavText[currentStatus]}</p>
          <p>{getInterviewsByStatus(interviews, currentStatus).length}</p>
        </button>
      ))}
    </div>
  );
}

export default InterviewStatusSelector;
