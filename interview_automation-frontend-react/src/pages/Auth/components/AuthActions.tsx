import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../AuthPage.module.scss';

function AuthActions(): React.JSX.Element {
  return (
    <div>
      <div className={styles.additionalActionsContainer}>
        <div>
          <input type="checkbox" />
          <h4>запам&rsquo;ятати мене </h4>
        </div>
        <Link className={styles.link} to="/forgot-password">
          <h4>Забули пароль?</h4>
        </Link>
      </div>
    </div>
  );
}

export default AuthActions;
