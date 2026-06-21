import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import deleteAccount from '../../../../../store/reducers/account/actions';
import { AppDispatch, RootState } from '../../../../../store/store';
import styles from './SettingsDeleteAccount.module.scss';
import UseEffectAfterSuccess from './UseEffectAfterSuccess';

function SettingsDeleteAccount(): React.JSX.Element {

  const dispatch: AppDispatch = useDispatch();
  const { error, success } =
  useSelector((state: RootState) => state.account);

  const handleDeleteAccount = (): void => {
    const confirmed = window.confirm('Ви впевнені, що хочете видалити акаунт? Цю дію не можна скасувати.');

    if (!confirmed) {

      return;
    }

    dispatch(deleteAccount());
  };

  return (
    <div className={styles.main_user_settings_notification}>
      <div className={styles.main_user_settings_title_notification}>Видалити акаунт?</div>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Акаунт успішно видалено</div>}
      <button type="button" onClick={handleDeleteAccount} className={styles.deleteButton}>
        Видалити акаунт
      </button>
      <UseEffectAfterSuccess />
    </div>
  );
}

export default SettingsDeleteAccount;
