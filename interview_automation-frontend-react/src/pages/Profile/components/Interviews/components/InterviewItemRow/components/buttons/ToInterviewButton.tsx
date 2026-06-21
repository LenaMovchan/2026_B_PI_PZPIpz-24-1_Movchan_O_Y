import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../../InterviewItemRow.module.scss';
import downloadInterviewReport from '../../../../../../../../components/Header/Report';

function ToInterviewButton({ id }: { id: number }): React.JSX.Element {
  return (
    <div className={styles.completedButton}>
      <Link to={`/interview/${id}`}>
        <div className={styles.checkButton} />
      </Link>
      <Link to={`/interview/${id}`}>
        <p>Переглянути</p>
      </Link>
      <button
        onClick={() => downloadInterviewReport(id)}
        className={styles.report_button}
      >
        Завантажити звіт
      </button>
    </div>
  );
}
export default ToInterviewButton;
