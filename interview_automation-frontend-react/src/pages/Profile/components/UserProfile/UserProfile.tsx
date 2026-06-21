import React from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import IInteractedUser from '../../../../models/user/IInteractedUser';
import styles from '../../profile.module.scss';
import InterviewActionPanel from '../Interviews/components/InterviewActionPanel/InterviewActionPanel';
import MyInterviews from '../Interviews/components/MyInterviews/MyInterviews';
import Portrait from '../Portarit/Portrait';
import UserCard from '../UserCard/UserCard';
import { useParams } from 'react-router-dom';
interface IUserProfile {
  user: IInteractedUser;
}

function UserProfile({ user }: IUserProfile): React.JSX.Element {
  const hasCompletedInterviews = user.completedInterviews.length > 0;
  const { roles } = useAppSelector((state) => state.user.userData);

  const isInterviewer = roles.some((role) => role.id === 2);

  return (
    <section className={styles.profileContainer}>
      <div className={`${styles.profileHeader} ${styles.userProfileHeader}`}>
        {isInterviewer && <InterviewActionPanel />}
      </div>
      <section className={styles.bodyContainer}>
        <UserCard user={user} />
        <Portrait />
      </section>
      {hasCompletedInterviews && (
        <MyInterviews interviews={user.completedInterviews} />
      )}
    </section>
  );
}
export default UserProfile;
