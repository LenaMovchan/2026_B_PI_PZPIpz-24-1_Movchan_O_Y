import React, { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { InterviewStatuses } from '../../../../models/profile/IInterview';
import { INewInterview } from '../../../../models/profile/INewInterview';
import { getInterviewId, updateInterviewStatus } from '../../../../store/reducers/interwiew/actions';
import styles from './ChangeStatusButton.module.scss';

function ChangeStatusButton():React.JSX.Element{
  const dispatch = useAppDispatch();
  const { status:interviewStatus,title,searcher,id:interviewId } = useAppSelector((state) => state.interview);
  const buttonText: Partial<Record<InterviewStatuses, string>> = useMemo(() => ({
    PLANNED: 'Почати інтерв’ю',
    ACTIVE: 'завершити інтерв’ю',
  }), []);

  const interviewLogic = async ():Promise<void> => {
    if (title && searcher.id) {
      if (!interviewId) {
        const addInterviewData:INewInterview = {
          status: 'PLANNED',
          searcherId: searcher.id,
          title,
        };
        dispatch(getInterviewId(addInterviewData));
      }

      if (interviewStatus === 'PLANNED') {
        dispatch(updateInterviewStatus({ id: interviewId, status: 'ACTIVE' }));
      }

      if (interviewStatus === 'ACTIVE') {
        dispatch(updateInterviewStatus({ id: interviewId, status: 'FINISHED' }));
      }
    }
  };
  const buttonClassName : Partial<Record<InterviewStatuses, string>> = useMemo(() => ({
    PLANNED: `${styles.button} ${styles.plannedButton}`,
    ACTIVE: ` ${styles.button} ${styles.activeButton}`,
  }), []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {Boolean(buttonText[interviewStatus]) && (
        <button
          type="button"
          onClick={interviewLogic}
          className={buttonClassName[interviewStatus]}
        >
          {buttonText[interviewStatus]}
        </button>
      )}
    </>
  );
}

export default ChangeStatusButton;
