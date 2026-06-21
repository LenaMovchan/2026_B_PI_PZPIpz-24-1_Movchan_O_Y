import React from 'react';
import { Link } from 'react-router-dom';

import styles from './AuthPage.module.scss';

function SuccessfulSignUp(): React.JSX.Element {
  return (
    <section className={styles.signContainer}>
      <h2>Дякуємо за реєстрацію!</h2>
      <p>
        Вітаємо у <strong>INTERVIEW IT!</strong>
        <br />
        Дякуємо, що приєдналися до нас.
      </p>
      <br />
      <p>
        Для завершення реєстрації, будь ласка, перевірте свою електронну пошту і
        підтвердіть свій акаунт, натиснувши на посилання в листі, який ми щойно
        вам відправили.
      </p>
      <br />
      <p>
        Якщо ви не отримали листа протягом декількох хвилин, будь ласка,
        перевірте папку &quot;Спам&quot; або &quot;Небажані&quot;.
      </p>
      <br />
      <p>
        Якщо у вас виникли будь-які питання, не соромтеся{' '}
        <Link to="/" className={styles.decorateLink}>
          зв&rsquo;язатися з нами
        </Link>
        .
      </p>
    </section>
  );
}
export default SuccessfulSignUp;
