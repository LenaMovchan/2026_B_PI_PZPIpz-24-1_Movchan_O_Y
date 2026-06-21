import React from 'react';

import { useAppDispatch } from '../../../../../../../../hooks/redux';
import { deleteInterview } from '../../../../../../../../store/reducers/interwiew/actions';
import styles from '../../InterviewItemRow.module.scss';

interface CancelButtonProps {
  id: number;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
}

function CancelButton({
  id,
  disabled = false
}: CancelButtonProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const handleCancelInterview = (): void => {
    dispatch(deleteInterview({ id, status: 'CANCELLED' }));
  };

  return (
    <button
      className={styles.tableButton}
      disabled={disabled}
      type="button"
      onClick={handleCancelInterview}
    >
      Видалити
      <span className={styles.cancelIcon} />
    </button>
  );
}

export default CancelButton;
