import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../AuthPage.module.scss';

interface SwitchAuthProps {
  to:string,
  text:string,
}

function SwitchAuth({ to, text }:SwitchAuthProps):React.JSX.Element {
  return (
    <button type="button" className={styles.switchAuthContainer}>
      <Link
        className={styles.switchAuthLink}
        to={to}
      >
        <p>{text}</p>
      </Link>
    </button>
  );
}
export default SwitchAuth;
