import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { setTitle } from '../../../../store/reducers/interwiew/interviewSlice';
import Input from '../../../Auth/components/Input';
import styles from './InterviewTitle.module.scss';

function InterviewTitle() :React.JSX.Element {
  const { title } = useAppSelector((state) => state.interview);
  const [titleText, setTitleText] = useState<string>(title);
  const dispatch = useAppDispatch();

  const handleSetInterviewTitle = (event: React.ChangeEvent<HTMLInputElement>):void => {
    setTitleText(event.target.value);
  };
  const submitTitle = ():void => {
    dispatch(setTitle(titleText));
  };

  return(
    title ? (
      <h3 className={styles.titleInputContainer}>Назва співбесіди: <p>{title}</p></h3>
    ) : (
      <div className={styles.titleInputContainer}>
        <Input
          type="text"
          id="title"
          placeholder="Введіть назву співбесіди"
          value={titleText}
          onChange={handleSetInterviewTitle}
          onBlur={submitTitle}
          inputName="Назва" error=""/>
      </div>
    )
  );
}

export default InterviewTitle;
