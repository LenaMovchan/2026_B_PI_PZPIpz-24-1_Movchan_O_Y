import React from 'react';

import userPhoto from '../../../../assets/default-full-photo.svg';
import IInteractedUser from '../../../../models/user/IInteractedUser';
import styles from './UserCard.module.scss';

interface IUserCard {
  user: IInteractedUser;
}

function UserCard({ user }: IUserCard): React.JSX.Element {
  const { avatarImgUrl, firstname, lastname } = user;

  return (
    <div className={styles['user-card']}>
      <div className={styles['card-top']} />
      <div className={styles['card-content']}>
        <div className={styles['profile-picture']}>
          <img src={avatarImgUrl && userPhoto} alt="user avatar" />
        </div>
        <div className={styles['profile-name']}>
          <h3>
            {firstname} {lastname}
          </h3>
        </div>
      </div>
      <div className={styles['profile-button']}>
        <button type="button">Налаштувати профіль</button>
      </div>
    </div>
  );
}

export default UserCard;
