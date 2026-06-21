import React from 'react';

import authImg from '../../assets/authImg.png';
import styles from './AuthPage.module.scss';

interface IProps {
  children: React.ReactNode;
}

function AuthPage({ children }: IProps): React.JSX.Element {
  return (
    <div className={styles.authPageContainer}>
      <div className={styles.contentContainer}>
        <h1>Interview it</h1>
        <img src={authImg} alt="auth-img" />
      </div>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
}

export default AuthPage;
