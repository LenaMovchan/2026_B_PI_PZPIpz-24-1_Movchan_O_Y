import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { getInterviewId } from '../../../../store/reducers/interwiew/actions';
import styles from '../../InterviewPage.module.scss';
import ChangeStatusButton from '../ChangeStatusButton/ChangeStatusButton';
import InterviewDate from '../InterviewDate/InterviewDate';
import InterviewerInfo from '../InterviewerInfo/InterviewerInfo';
import InterviewTitle from '../InterviewTitle/InterviewTitle';
import SearcherInfo from '../SearcherInfo/SearcherInfo';
import Status from '../Status/Status';
import Timer from '../Timer/Timer';

function InterviewCreator():React.JSX.Element{
  const navigate = useNavigate();
  const { id,searcher,title } = useAppSelector((state) => state.interview);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (title&&searcher.id){
      dispatch(getInterviewId({ status:'PLANNED',searcherId:searcher.id,title }));
    }

    if (id) {
      navigate(`/interview/${id}`);
    }
  }, [title,searcher,dispatch, id, navigate]);

  return (
    <div className={styles.pageContainer}>
      <section className={styles.header}>
        <div className={styles.flexRowBlock}>
          <Timer/>
          <Status/>
        </div>
        <ChangeStatusButton/>
      </section>

      <section className={styles.interviewInfoContainer}>
        <InterviewTitle/>
        <h3 className={styles.flexRowBlock}>Дата: <InterviewDate/></h3>
      </section>
      <section className={styles.interviewsParticipantsContainer}>

        <InterviewerInfo/>
        <SearcherInfo />
      </section>
    </div>
  );
}
export default InterviewCreator;
