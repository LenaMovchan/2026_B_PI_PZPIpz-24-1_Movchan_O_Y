import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch } from '../../../../../../hooks/redux';
import { resetInterviewState } from '../../../../../../store/reducers/interwiew/interviewSlice';
import styles from '../../../../profile.module.scss';
import InterviewScheduler from '../InterviewScheduler/InterviewScheduler';

function InterviewActionPanel(): React.JSX.Element {
  const [showNewInterview, setShowNewInterview] = useState(false);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const handleNewInterviewClick = (): void => setShowNewInterview(true);
  const dispatch = useAppDispatch();
  const handleSchedulerClose = (): void => {
    setShowInterviewScheduler(false);
    setShowNewInterview(false);
  };
  const handleLinkToInterview = (): void => {
    dispatch(resetInterviewState());
  };

  const renderNewInterviewBlock = (): React.JSX.Element => (
    <div className={styles.actionPanelButtonContainer}>
      <Link to="/interview" className={styles.actionPanelButton} onClick={handleLinkToInterview}>Розпочати</Link>
      <button type="button" className={styles.actionPanelButton} onClick={() => setShowInterviewScheduler(true)}>
        Запланувати
      </button>
      <button type="button" className={styles.closeButton} onClick={() => setShowNewInterview(false)}>
        X
      </button>
    </div>
  );

  const renderNewInterviewButton = (): React.JSX.Element => (
    <div className={styles.newInterviewButton}>
      {!showNewInterview ? (
        <button type="button" className={styles.actionPanelButton} onClick={handleNewInterviewClick}>
          Нове інтрев&apos;ю
        </button>
      ) : (
        renderNewInterviewBlock()
      )}
    </div>
  );

  return (
    <div>
      {!showInterviewScheduler ? (
        renderNewInterviewButton()
      ) : (
        <InterviewScheduler onClose={handleSchedulerClose} />
      )}
    </div>
  );
}
export default InterviewActionPanel;
