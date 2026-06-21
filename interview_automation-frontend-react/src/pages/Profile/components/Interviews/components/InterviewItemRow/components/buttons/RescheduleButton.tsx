import React, { useState } from 'react';

import { useAppDispatch } from '../../../../../../../../hooks/redux';
import { updateInterviewById } from '../../../../../../../../store/reducers/interwiew/actions';
import styles from '../../InterviewItemRow.module.scss';

function RescheduleButton({
  id,
  title
}: {
  id: number;
  title: string;
}): React.JSX.Element {
  const [plannedDateTime, setPlannedDateTime] = useState<Date | null>(null);
  const [showDateInput, setShowDateInput] = useState(false);
  const dispatch = useAppDispatch();

  const handleChangePlannedTime = (): void => {
    if (plannedDateTime) {
      dispatch(updateInterviewById({ id, plannedDateTime, title }));
    }
  };

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const dateValue = event.target.value;
    setPlannedDateTime(dateValue ? new Date(dateValue) : null);
  };

  return (
    <>
      <button
        className={styles.tableButton}
        type="button"
        onClick={() => setShowDateInput(true)}
      >
        Перенести
        <span className={styles.scheduleIcon} />
      </button>

      {showDateInput && (
        <>
          <input type="datetime-local" onChange={handleDateChange} />
          <button type="button" onClick={handleChangePlannedTime}>
            +
          </button>
        </>
      )}
    </>
  );
}

export default RescheduleButton;
