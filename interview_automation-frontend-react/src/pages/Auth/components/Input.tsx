import React, { ForwardedRef, forwardRef, useState } from 'react';

import passwordSecurityImg from '../../../assets/passwordSecurityImg.svg';
import styles from './input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputName:string
  type:string
  error:string | undefined
}

const Input = forwardRef(
  ({
    inputName, type, error, ...rest
  }: InputProps, ref: ForwardedRef<HTMLInputElement>): React.ReactElement => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = showPassword ? 'text' : 'password';

    return (
      <label className={styles.inputContainer}>
        <input
          type={type === 'password' ? handleShowPassword : type}
          {...rest}
          ref={ref}
        />
        <span>{inputName}</span>
        {type === 'password' && (
          <button
            type="button"
            tabIndex={0}
            className={styles.togglePasswordButton}
            onClick={() => setShowPassword((prevState) => !prevState)}
          >
            <img src={passwordSecurityImg} alt="password security eye" style={{ width: '24px', height: '24px' }} />
          </button>
        )}
        {!!error && (
          <p className={styles.formErr}>
            {error}
          </p>
        )}
      </label>

    );
  },
);

export default Input;
