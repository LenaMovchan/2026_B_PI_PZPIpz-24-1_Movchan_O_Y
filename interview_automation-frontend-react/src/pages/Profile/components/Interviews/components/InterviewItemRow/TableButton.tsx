import React from 'react';

import { InterviewStatuses } from '../../../../../../models/profile/IInterview';
import CancelButton from './components/buttons/CancelButton';
import DeleteButton from './components/buttons/DeleteButton';
import FeedbackButton from './components/buttons/FeedbackButton';
import RescheduleButton from './components/buttons/RescheduleButton';
import ToInterviewButton from './components/buttons/ToInterviewButton';

interface TableButtonProps {
  id: number;
  status: InterviewStatuses;
  title: string;
}

function TableButton({
  status,
  id,
  title
}: TableButtonProps): React.JSX.Element {
  const renderTableButton = (): React.JSX.Element => {
    switch (status) {
      case 'PLANNED':
        return (
          <>
            <CancelButton id={id} />
            <DeleteButton id={id} />
            <RescheduleButton id={id} title={title} />
          </>
        );
      case 'ACTIVE':
        return <ToInterviewButton id={id} />;

      case 'CANCELLED':
        return <CancelButton id={id} disabled />;

      case 'FINISHED':
        return <FeedbackButton />;

      default:
        return <ToInterviewButton id={id} />;
    }
  };

  return renderTableButton();
}

export default TableButton;
