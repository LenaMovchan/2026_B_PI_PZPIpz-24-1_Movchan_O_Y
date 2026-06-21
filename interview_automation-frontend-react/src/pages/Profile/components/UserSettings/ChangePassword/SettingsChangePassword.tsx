import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import changePassword  from '../../../../../store/reducers/password/actions';
import { setConfirmNewPassword, setCurrentPassword, setError,setNewPassword }
  from '../../../../../store/reducers/password/passwordSlice';
import { AppDispatch, RootState } from '../../../../../store/store';
import Input from '../../../../Auth/components/Input';
import styles from './SettingsChangePassword.module.scss';

function SettingsChangePassword(): React.JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const { password, newPassword, repeatNewPassword, error, success } =
  useSelector((state: RootState) => state.password);

  const handlePasswordChange = (): void => {
    if (newPassword !== repeatNewPassword) {
      dispatch(setError('Новий пароль та підтвердження паролю не збігаються'));

      return;
    }
    dispatch(changePassword({ password, newPassword, repeatNewPassword }));
  };

  return (
    <div className={styles.main_user_settings_change_password}>
      <div className={styles.main_user_settings_title_notification}>Налаштування конфіденційності</div>
      <div>
        <Input
          inputName="Поточний пароль"
          type="password"
          id="password"
          placeholder="поточний пароль"
          value={password}
          onChange={(e) => dispatch(setCurrentPassword(e.target.value))}
          error={undefined}
        />
      </div>
      <div>
        <Input
          inputName="Новий пароль"
          type="password"
          id="newPassword"
          placeholder="новий пароль"
          value={newPassword}
          onChange={(e) => dispatch(setNewPassword(e.target.value))}
          error={undefined}
        />
      </div>
      <div>
        <Input
          inputName="Підтвердити новий пароль"
          type="password"
          id="repeatNewPassword"
          placeholder="Підтвердити новий пароль"
          value={repeatNewPassword}
          onChange={(e) => dispatch(setConfirmNewPassword(e.target.value))}
          error={undefined}
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Пароль успішно змінено</div>}
      <button type="button" onClick={handlePasswordChange} className={styles.submitChangePassword}>
        Змінити пароль
      </button>
    </div>
  );
}

export default SettingsChangePassword;

