import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import styles from './Timer.module.scss';

type CombinedProps = React.HTMLProps<HTMLDivElement>;

function Timer(rest: CombinedProps): React.JSX.Element {
  const [time, setTime] = useState(0);
  const { status: interviewStatus, startDateTime, endDateTime } = useAppSelector((state) => state.interview);

  useEffect(() => {
    const changeTime = (): void => {

      if (startDateTime) {
        const endMillis = endDateTime
          ? new Date(endDateTime).getTime()
          : new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const timeMillis = endMillis - new Date(startDateTime).getTime();

        setTime(timeMillis);
      }
    };

    changeTime();

    if (interviewStatus === 'ACTIVE') {
      const intervalId = setInterval(changeTime, 200);

      return (): void => clearInterval(intervalId);
    }

    return (): void => { };
  }, [interviewStatus, startDateTime, endDateTime]);

  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const clock = `${hours ? `${hours}:`:''}${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds:`0${seconds}`}`;

  return (
    <div {...rest}>
      <div className={styles.stopwatch}>
        Час співбесіди:
        {' '}
        <span>{clock}</span>
      </div>
    </div>
  );
}
export default Timer;
