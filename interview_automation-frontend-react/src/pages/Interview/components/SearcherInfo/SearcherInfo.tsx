import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { getUserByEmail } from '../../../../store/reducers/interwiew/actions';
import Input from '../../../Auth/components/Input';
import styles from './SearcherInfo.module.scss';

function SearcherInfo():React.JSX.Element{
  const { id,firstname,lastname }= useAppSelector((state) => state.interview.searcher);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');

  const getSearcher = (event: React.FormEvent<HTMLFormElement>): void => {
    try {
      event.preventDefault();
      dispatch(getUserByEmail(event.currentTarget.userEmail.value));
    }catch {
      setMessage('Користувач не знайдений\n');
    }
  };

  return (
    <section className={styles.searcherInfoContainer}>
      {
        id? (<h3> Кандидат: {firstname} {lastname} </h3>):
          (<form onBlur={getSearcher} className={styles.input}>
            <Input
              inputName="user Email"
              type="text"
              id="userEmail"
              placeholder="ВВведіть email шукача"
              error={message}/>
          </form>)
      }
    </section>
  );
}

export default SearcherInfo;
