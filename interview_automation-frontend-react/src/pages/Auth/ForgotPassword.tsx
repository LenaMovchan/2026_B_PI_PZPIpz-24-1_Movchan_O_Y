import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import snapshotApi from '../../api/request';
import EmailRegexp from '../../common/emailRegexp';
import { ISignIn } from '../../models/auth/ISignIn';
import styles from './AuthPage.module.scss';
import Input from './components/Input';

export default function ForgotPassword(): React.JSX.Element {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<ISignIn>({ mode: 'onBlur' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ISignIn> = async (data): Promise<void> => {
    setMessage('Відправка даних...');
    const response: boolean = await snapshotApi.post('/auth/send-reset-password-email', data);

    if (response === true) {
      navigate('/email-sent');
    } else if (response === false) {
      setMessage('Ви не зареестровані на нашому сервісі!');
    } else {
      setMessage('При відправці пошти сталася помилка, спробуйте пізніше!');
    }
  };

  return (
    <div className={styles.signContainer}>

      <form onSubmit={handleSubmit(onSubmit)}>
        <legend>
          <h2>Забули пароль?</h2>
          <p>
            Нема про що турбуватися, ми надішлемо вам повідомлення, щоб
            <br />
            допомогти вам скинути пароль.
          </p>
        </legend>
        <div>
          <div className={styles.formInputsContainer}>
            <Input
              inputName="Email"
              type="text"
              id="login"
              {...register('email', {
                pattern: {
                  value: EmailRegexp,
                  message: 'Неправильна адреса електронної пошти',
                },
                required: {
                  value: true,
                  message: 'Вкажіть ваш email',
                },
              })}
              placeholder="Введіть електронну адресу"
              error={errors.email?.message || message}
              onChange={() => setMessage('')}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Надіслати посилання для скидання
          </button>
        </div>
      </form>
    </div>
  );
}