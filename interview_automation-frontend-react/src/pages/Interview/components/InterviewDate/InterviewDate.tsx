import React from 'react';

import { useAppSelector } from '../../../../hooks/redux';

function InterviewDate(): React.JSX.Element {
  const { status: interviewStatus, plannedDateTime, endDateTime } = useAppSelector((state) => state.interview);

  const getDateValue = (): Date => {
    switch (interviewStatus) {
      case 'PLANNED':
      case 'ACTIVE':
        return plannedDateTime ? new Date(plannedDateTime) : new Date();
      case 'FINISHED':
        return endDateTime ? new Date(endDateTime) : new Date();
      default:
        return new Date();
    }
  };

  const formatDate = (date: Date): string => date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', '');

  const dateValue = getDateValue();
  const formattedDate = formatDate(dateValue);

  return (
    <div>{formattedDate}</div>
  );
}
export default InterviewDate;
