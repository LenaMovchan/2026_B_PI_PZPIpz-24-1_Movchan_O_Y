import Slider  from '@mui/material/Slider';
import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { changeGrade } from '../../../../store/reducers/profile/actions';
import styles from './Question.module.scss';

function GradeQuestion({ questionId }:{ questionId:number|null }): React.JSX.Element {
  const { id:interviewId } = useAppSelector((state) => state.interview);
  const [grade, setGrade] = useState(0);
  const dispatch = useAppDispatch();

  if (!questionId) return <section className={styles.questionGradeContainer} />;
  const handleChangeGrade = (
    event: Event,
    value: number | number[]): void => {
    event.preventDefault();
    setGrade(typeof value === 'number' ? value : value[0]);
  };
  const handleSubmit  = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    dispatch(changeGrade({ id:questionId, interviewId: Number(interviewId), grade }));
  };

  return (
    <form className={styles.questionGradeContainer} onSubmit={handleSubmit}>
      <label className={styles.sliderContainer}>
        <h4>Оцініть запитання: </h4>
        <Slider
          arial-label="Temperature"
          defaultValue={30}
          valueLabelDisplay="auto"
          shiftStep={30}
          step={10}
          marks
          min={0}
          max={100}
          onChange={handleChangeGrade}
          sx={{
            width:160,
            color:'#F1E15B'
          }}
        />
      </label>
      <button type="submit" disabled={Boolean(!grade)} className={styles.questionGradeButton}>зарахувати</button>
    </form>
  );
}

export default GradeQuestion;
