import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getMyInterviews } from '../../store/reducers/profile/actions';
import getInterval from '../../utils/notification/getInterval';
import { getTimeToInterview } from '../../utils/notification/getTimeToInterview';
import styles from './Header.module.scss';

function Notification():React.JSX.Element {
  const { interviews } = useAppSelector((state) => state.profile);
  const [remainingTimeInMillis, setRemainingTimeInMillis] = useState(getTimeToInterview(interviews).time);
  const [nearestInterviewDate, setNearestInterviewDate] = useState({ id: 0,title:'' });
  const dispatch = useAppDispatch();
  const weekInMillis = 604800000;
  const fifteenMinInMs = 900000;

  useEffect(() => {
    (async (): Promise<void> => {
      await dispatch(getMyInterviews());
    })();
  }, [dispatch]);

  useEffect(() => {
    const updateInterval = (): void => {
      const nearestInterview = getTimeToInterview(interviews);

      setRemainingTimeInMillis(nearestInterview.time);

      setNearestInterviewDate({ id:nearestInterview.id, title:nearestInterview.title });
    };
    updateInterval();

    const intervalInMillis = getInterval(remainingTimeInMillis);

    const intervalID = setInterval(() => {
      updateInterval();
    }, intervalInMillis);

    if (remainingTimeInMillis < -fifteenMinInMs) {
      clearInterval(intervalID);
    }

    return (): void => clearInterval(intervalID);
  }, [remainingTimeInMillis, interviews]);

  function formatTime():string {
    const sec = Math.round(Math.abs(remainingTimeInMillis) / 1000);
    const min = Math.round(sec / 60);
    const hours = Math.round(min / 60);
    const days = Math.round(hours / 24);

    if (sec < 60) {
      return ` ${remainingTimeInMillis < 0 ? '-' : ''}${sec} секунд`;
    }

    if (min < 60) {
      return ` ${remainingTimeInMillis < 0 ? '-' : ''}${min} хв.`;
    }

    if (hours < 24) {
      return ` ${hours} год.`;
    }

    return ` ${days} дн.`;
  }

  return (
    <div className={styles.header_notification}
    // style={{
    //   fontSize: '10px',
    //   // display:'none',
    //   color: remainingTimeInMillis >= 0 ? 'black' : 'red',

    // }}
    >
      {remainingTimeInMillis > -fifteenMinInMs && remainingTimeInMillis < weekInMillis
        ? (
          <div className={styles.header_notification_inside}
          // style={{
          //   fontSize: '10px',
          //   //
          //   color: remainingTimeInMillis >= 0 ? 'black' : 'red',
          //   display:'flex',
          //   flexDirection:'row',
          //   gap:'1rem',
          //   textTransform:'capitalize'
          // }}
          >
            <p className={styles.header_notification_message}>
            Наступне  інтерв&apos;ю:
              {formatTime()}
            </p>
            <Link className={styles.header_notification_link} to={`interview/${nearestInterviewDate.id}`} >
              переглянути деталі
              {/* {nearestInterviewDate.title} */}
            </Link>

          </div>
        ) : (<div>На цьому тижні у вас ще немає інтерв&apos;ю</div>)}
    </div>
  );
}
export default Notification;
