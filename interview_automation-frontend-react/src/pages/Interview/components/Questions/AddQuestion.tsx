import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  addQuestion,
  getGeminiQuestions,
  getSkillQuestions
} from '../../../../store/reducers/interwiew/actions';
import styles from './AddQuestion.module.scss';

interface AddQuestionProps {
  onClose: () => void;
  skillId: number;
}

function AddQuestion({
  onClose,
  skillId
}: AddQuestionProps): React.JSX.Element {
  const {
    interviewer,
    id: interviewId,
    currentSkillQuestions,
    geminiQuestions
  } = useAppSelector((state) => state.interview);
  const { id: interviewerId } = interviewer;
  const dispatch = useAppDispatch();
  const [questionText, setQuestionText] = useState(''); // Состояние для хранения значения текстового поля

  useEffect(() => {
    const getQuestions = async (): Promise<void> => {
      await dispatch(getSkillQuestions(skillId));
      await dispatch(getGeminiQuestions(skillId));
    };
    (async (): Promise<void> => {
      await getQuestions();
    })();
  }, [dispatch, skillId]);

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    e.preventDefault();
    setQuestionText(e.target.value);
  };
  const handleProposedQuestion = (text: string): void => {
    setQuestionText(text);
  };
  const handleAddQuestion = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(
      addQuestion({
        interviewId,
        interviewerId,
        skillId,
        question: questionText
      })
    );

    onClose();
  };

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.formAddQuestion}
        name="bookInterview"
        onSubmit={handleAddQuestion}
      >
        <section className={styles.formBody}>
          <h3 className={styles.formHeader}>Ваші запитання:</h3>
          <div className={styles.questionContainer}>
            {currentSkillQuestions.slice(0, 5).map((q) => (
              <div key={q.id} className={styles.textButtonContainer}>
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => handleProposedQuestion(q.question)}
                >
                  {q.question}
                </button>
              </div>
            ))}
          </div>

          {/* <h3 className={styles.formHeader}>Запропановані запитання:</h3>

          <div className={styles.questionContainer}>
            {/* {geminiQuestions.slice(0, 5).map((q) => (
              <div key={q} className={styles.textButtonContainer}>

                <button

                  type="button"
                  className={styles.textButton}
                  onClick={() => handleProposedQuestion(q)}>{q}</button>
              </div>
            ))} */}
          {/* </div> */}
          <textarea
            placeholder="Введіть питання..."
            value={questionText}
            onChange={handleQuestionChange}
            className={styles.questionContainer}
          />
        </section>
        <div className={styles.formFooter}>
          <button className={styles.submitButton} type="submit">
            Додати запитання
          </button>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={onClose}
          >
            Назад
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuestion;
