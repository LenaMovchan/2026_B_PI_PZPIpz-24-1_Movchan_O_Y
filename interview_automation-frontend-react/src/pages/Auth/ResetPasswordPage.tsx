import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import snapshotApi from '../../api/request';
import PasswordRegex from '../../common/passwordRegexp';
import { IResetPassword } from '../../models/auth/IResetPassword';
import styles from './AuthPage.module.scss';
import Input from './components/Input';

export default function ResetPasswordPage(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<IResetPassword>({
    mode: 'onBlur',
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IResetPassword> = async (data): Promise<void> => {
    const resetToken = localStorage.getItem('reset-token');
    let body;

    if (resetToken) {
      body = { ...data, 'token': resetToken };
    } else {
      navigate('/invalid-link');
    }

    const isReseted: boolean = await snapshotApi.patch('/auth/reset-password', body);

    if (isReseted) {
      navigate('/');
    } else {
      navigate('/invalid-link');
    }

    reset();
  };

  return (
    <section className={styles.signContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <legend>
          <h2>Відновлення паролю!</h2>
          <p>Введіть новий пароль для доступу до свого акаунта</p>
        </legend>
        <div>
          <div className={styles.formInputsContainer}>
            <Input
              inputName="Password"
              type="password"
              id="password"
              {...register('password', {
                pattern: {
                  value: PasswordRegex,
                  message: 'Пароль має складатися з мінімум 8 літер, цифр і символів.',
                },
                required: {
                  value: true,
                  message: 'Пароль має складатися з мінімум 8 літер, цифр і символів.',
                },
              })}
              error={errors.password?.message}
              placeholder="Введіть пароль"
            />
            <Input
              inputName="Password"
              type="password"
              id="confirm-password"
              {...register('repeatPassword', {
                required: {
                  value: true,
                  message: 'Введіть пароль ще раз',
                },
                validate: (value) => {
                  const { password } = getValues();

                  return password === value || 'Паролі не співпадають';
                },
              })}
              error={errors.repeatPassword?.message}
              placeholder="Повторіть пароль"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Змінити пароль
          </button>
        </div>

      </form>
    </section>
  );
}