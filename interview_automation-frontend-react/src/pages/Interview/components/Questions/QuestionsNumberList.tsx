import React from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import styles from './Question.module.scss';

interface Props{
  onClick:(num:number)=>void
}

function QuestionsNumberList ({ onClick }:Props):React.JSX.Element{
  const { questions } = useAppSelector((state) => state.interview);

  return (
    <section className={styles.questionSelector}>
      <h3>Запитання №:</h3>
      <div className={styles.numberList}>
        {questions.map((question, index) => (
          <button type="button" key={question.id} onClick={()=>onClick(question.id)}><h3>{index+1}</h3></button>
        ))}
      </div>
    </section>
  );
}

export default QuestionsNumberList;
