import React, { useEffect } from 'react';
import {  useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import getUserById from '../../store/reducers/interactedUsers/actions';
import { getLowerSkills, getMyInterviews, getPortrait } from '../../store/reducers/profile/actions';
import CurrentUserProfile from './components/CurrentUserProfile/CurrentUserProfile';
import UserProfile from './components/UserProfile/UserProfile';

function Profile(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { userId= '0' } = useParams<{ userId: string }>();
  const { id: currentUserId } = useAppSelector((state) => state.user.userData);
  const user = useAppSelector((state) => state.interactedUsers.userData);
  useEffect(() => {
    const fetchProfileData = async (): Promise<void> => {
      await dispatch(getMyInterviews());
      await dispatch(getLowerSkills(Number(userId)));
      await dispatch(getPortrait({ id: userId as string }));
      await dispatch(getUserById(+userId));
    };

    (async ():Promise<void> => {
      await fetchProfileData();
    })();
  }, [dispatch, userId]);

  return (
    <div>
      {currentUserId === (+userId)?(<CurrentUserProfile user={user}/>):(<UserProfile user={user}/>)}
    </div>
  );
}

export default Profile;
