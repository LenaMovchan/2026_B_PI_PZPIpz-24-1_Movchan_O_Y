import classNames from 'classnames';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import useForce from '../../utils/useForce';
import styles from './Header.module.scss';

function HeaderSignIn(): React.JSX.Element {
  const location = useLocation();
  useForce(location);

  return (
    <header className={styles.header}>
      <div className={styles.header_top}>
        <div className={styles.header_top_location}>Україна</div>
        <div className={styles.header_top_buttonBar}>
          <Link
            to="sign-in"
            className={classNames(
              styles.header_top_button_signin,
              styles.header_link
            )}
          >
            УВІЙТИ
          </Link>
          <div className={styles.header_top_buttonBar_line} />
          <Link
            to="sign-up"
            className={classNames(
              styles.header_top_button_signup,
              styles.header_link
            )}
          >
            ЗАРЕЄСТРУВАТИСЬ
          </Link>
        </div>
      </div>
      <div className={styles.header_title}>INTERVIEW IT</div>
    </header>
  );
}

export default HeaderSignIn;
