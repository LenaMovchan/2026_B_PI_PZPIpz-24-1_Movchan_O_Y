import React, { useState } from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import { InterviewStatuses } from '../../../../models/profile/IInterview';
import IInterviewPreview from '../../../../models/profile/IInterviewPreview';
import IInteractedUser from '../../../../models/user/IInteractedUser';
import { getInterviewsByStatus } from '../../../../utils/notification/getTimeToInterview';
import styles from '../../profile.module.scss';
import InterviewActionPanel from '../Interviews/components/InterviewActionPanel/InterviewActionPanel';
import MyInterviews from '../Interviews/components/MyInterviews/MyInterviews';
import InterviewStatusSelector from '../InterviewStatusSelector/InterviewStatusSelector';
import ProfileVisibility from '../ProfileVisibility/ProfileVisibility';
import UserCard from '../UserCard/UserCard';
import UserSkills from '../UserSkills/UserSkills';

interface ICurrentUserProfile {
  user:IInteractedUser
}

function CurrentUserProfile({ user }:ICurrentUserProfile):React.JSX.Element{
  const [status, setStatus] = useState<InterviewStatuses>('PLANNED');
  const interviews = useAppSelector((state) => state.profile.interviews);
  const { roles } = useAppSelector((state) => state.user.userData);

  const isInterviewer = roles.some((role)=>role.id === 2);
  const actualStatus: InterviewStatuses = status || '';
  const actualInterviews:IInterviewPreview[] = actualStatus === '' ? interviews :
    getInterviewsByStatus(interviews, actualStatus);
  const handleChangeStatus=(newStatus: InterviewStatuses):void => {
    setStatus(newStatus as InterviewStatuses);
  };

  return (
    <section className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2>Мій профіль</h2>
        {isInterviewer && <InterviewActionPanel/>}
      </div>
      <section className={styles.bodyContainer}>
        <section className={styles.avatar}>
          <ProfileVisibility/>
          <UserCard user={user}/>
          <UserSkills roles={roles}/>
          <div/>
        </section>
        <section className={styles.InterviewStatisticsContainer}>
          <div>
            <h3>Статистика співбесід</h3>
            <InterviewStatusSelector onClick={handleChangeStatus} status={status}/>
          </div>
          <div>
            <div className={styles.tableHeader}>
              <h3>Журнал співбесід</h3>
              <button type="button" className={styles.link} onClick={() => setStatus('')}>
                <h5>всі співбесіди</h5>
              </button>
            </div>
            <MyInterviews interviews={actualInterviews}/>
          </div>
        </section>
      </section>
    </section>);
}

export default CurrentUserProfile;
