import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import snapshotApi from '../../api/request';
// import EmailRegexp from '../../common/emailRegexp.ts';
// import passwordRegexp from '../../common/passwordRegexp.ts';
// import EmailRegexp from '../../common/emailRegexp';
import { useAppDispatch } from '../../hooks/redux';
import { ISignIn } from '../../models/auth/ISignIn';
import getUser from '../../store/reducers/user/actions';
import styles from './AuthPage.module.scss';
import AuthActions from './components/AuthActions';
import Input from './components/Input';
import SwitchAuth from './components/SwitchAuth';
import OAuth2 from './OAuth2';

function SignInPage(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ISignIn>({ mode: 'onBlur' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<ISignIn> = async (data): Promise<void> => {
    const token: { access_token: string; refresh_token: string } =
      await snapshotApi.post('/auth/authenticate', data);

    if (token) {
      localStorage.setItem('token', token.access_token);
      localStorage.setItem('refresh_token', token.refresh_token);
      dispatch(getUser());
      navigate('/');
      reset();
    } else {
      setMessage('Невірний логін або пароль');
    }
  };

  return (
    <section className={styles.signContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <legend>
          <h2>З поверненням у INTERVIEW IT</h2>
          <p>Введіть свої дані щоб продовжити</p>
        </legend>
        <div>
          <div className={styles.formInputsContainer}>
            <Input
              inputName="Email"
              type="text"
              id="login"
              {...register('email', {
                // pattern: {
                //   value: EmailRegexp,
                //   message: 'Неправильна адреса електронної пошти',
                // },
                required: {
                  value: true,
                  message: 'Вкажіть ваш email'
                }
              })}
              placeholder="Введіть електронну адресу"
              error={message || errors.email?.message}
            />

            <Input
              inputName="Password"
              type="password"
              id="password"
              placeholder="Введіть пароль"
              {...register('password', {
                required: {
                  value: true,
                  message: 'Вкажіть ваш пароль'
                }
              })}
              error={message || errors.password?.message}
            />
          </div>
        </div>
        <AuthActions />
        <button type="submit" className={styles.submitButton}>
          Увійти
        </button>
      </form>
      <SwitchAuth
        to="/sign-up"
        text="Ще немає облікового запису? Зареєструватися"
      />
      <OAuth2 text="Або увійдіть за допомогою:" />
    </section>
  );
}
export default SignInPage;
