import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import snapshotApi from '../../api/request';
import EmailRegexp from '../../common/emailRegexp';
import PasswordRegex from '../../common/passwordRegexp';
import { ISignUp } from '../../models/auth/ISignUp';
import styles from './AuthPage.module.scss';
import AuthActions from './components/AuthActions';
import Input from './components/Input';
import SwitchAuth from './components/SwitchAuth';
import OAuth2 from './OAuth2';

export default function SignUpPage(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm<ISignUp>({
    mode: 'onBlur'
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ISignUp> = async (data): Promise<void> => {
    const { ...userData } = data;

    const response: boolean = await snapshotApi.post('/auth/register', {
      ...userData
    });

    if (response) {
      navigate('/thank-you');
      reset();
    }
  };

  return (
    <section className={styles.signContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <legend>
          <h2>Привіт! Вітаємо у INTERVIEW IT</h2>
          <p>Введіть облікові дані для доступу до свого акаунта</p>
        </legend>
        <div>
          <div className={styles.formInputsContainer}>
            <Input
              inputName="Прізвище та Ім’я"
              type="text"
              id="first-name"
              {...register('firstname', {
                required: {
                  value: true,
                  message: "Вкажіть ваше Ім'я"
                }
              })}
              placeholder="Введіть ім'я"
              error={errors.firstname?.message}
            />
            <Input
              inputName="Email"
              type="text"
              id="login"
              {...register('email', {
                pattern: {
                  value: EmailRegexp,
                  message: 'Неправильна адреса електронної пошти'
                },
                required: {
                  value: true,
                  message: 'Вкажіть ваш email'
                }
              })}
              placeholder="Введіть електронну адресу"
              error={errors.email?.message}
            />
            <Input
              inputName="Password"
              type="password"
              id="password"
              {...register('password', {
                pattern: {
                  value: PasswordRegex,
                  message:
                    'Пароль має складатися з мінімум 8 літер, цифр і символів.'
                },
                required: {
                  value: true,
                  message:
                    'Пароль має складатися з мінімум 8 літер, цифр і символів.'
                }
              })}
              error={errors.password?.message}
              placeholder="Введіть пароль"
            />
            <Input
              inputName="Password"
              type="password"
              id="confirm-password"
              {...register('confirmPassword', {
                required: {
                  value: true,
                  message: 'Введіть пароль ще раз'
                },
                validate: (value) => {
                  const { password } = getValues();

                  return password === value || 'Паролі не співпадають';
                }
              })}
              error={errors.confirmPassword?.message}
              placeholder="Повторіть пароль"
            />
          </div>
          <AuthActions />
          <button type="submit" className={styles.submitButton}>
            Зареєструватись
          </button>
        </div>
      </form>
      <SwitchAuth to="/sign-in" text="Вже є акаунт?" />

      <OAuth2 text="Або зареєструйтеся за допомогою:" />
    </section>
  );
}
