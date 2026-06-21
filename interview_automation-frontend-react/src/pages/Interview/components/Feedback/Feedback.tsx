import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { changeFeedback } from '../../../../store/reducers/profile/actions';
import styles from './FeedBack.module.scss';

function Feedback(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const interview = useAppSelector((state) => state.profile.interview);
  const { feedback }= useAppSelector((state) => state.interview);
  const [newFeedback, setNewFeedback] = useState('');
  const [showTextField, setShowTextField] = useState(Boolean(feedback));
  const handleChangeFeedback = (): void => {
    if (newFeedback) setShowTextField(true);
    dispatch(changeFeedback({ interviewId: interview.id, feedback: newFeedback }));
  };

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.feedbackSubContainer}>
        <label htmlFor="feedback"><h2> Залишити відгук</h2></label>
        {showTextField?
          <p>{feedback}</p>:
          (<textarea
            className={styles.textarea}
            name="feedback"
            id="feedback"
            cols={30}
            rows={10}
            value={newFeedback}
            placeholder="залишити відгук можна тут"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setNewFeedback(e.target.value)}
          />)
        }
        {!showTextField?(
          <button
            className={styles.feedbackSubmitButton}
            type="submit"
            onClick={handleChangeFeedback}
          >
          Зберегти
          </button>
        ):
          (
            <button
              className={styles.feedbackSubmitButton}
              type="submit"
              onClick={()=>setShowTextField(false)}
            >
            Відрегадувати
            </button>)
        }
      </div>
    </div>);

}

export default Feedback;
