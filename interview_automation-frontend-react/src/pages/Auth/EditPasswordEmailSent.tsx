import React from 'react';
import { Link } from 'react-router-dom';

import styles from './AuthPage.module.scss';

function EditPasswordEmailSent():React.JSX.Element {
  return (
    <section className={styles.signContainer}>
      <h2>Відновлення паролю!</h2>
      <p>
        Для відновлення паролю, будь ласка, перевірте свою електронну пошту,
        {' '}
        там ви знайдете подальші інструкції.
      </p>
      <br />
      <p>
        Якщо ви не отримали листа протягом декількох хвилин, будь ласка,
        перевірте папку &quot;Спам&quot; або &quot;Небажані&quot;.
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
export default EditPasswordEmailSent;