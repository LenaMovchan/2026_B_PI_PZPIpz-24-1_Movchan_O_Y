import React from 'react';
import { Link } from 'react-router-dom';

import styles from './AuthPage.module.scss';

function InvalidResetTokenPage():React.JSX.Element {
  return (
    <section className={styles.signContainer}>
      <h2>Помилка при відновленні паролю!</h2>
      <p>
        Сталася помилка при спробі відновлення паролю,
        {' '}
        можливо термін дії посилання скінчився!
      </p>
      <br />
      <p>
        Спробуйте
        {' '}
        <Link to="/forgot-password" className={styles.decorateLink}>відновити пароль</Link>
        {' '}
        заново.
      </p>
      <br />
      <p>
        Якщо у вас виникли будь-які питання, не соромтеся
        {' '}
        <Link to="/" className={styles.decorateLink}>зв&rsquo;язатися з нами</Link>
        .
      </p>

    </section>
  );
}
export default InvalidResetTokenPage;