import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import snapshotApi from '../../../../api/request';
import IInteractedUser from '../../../../models/user/IInteractedUser';
import UserProfile from './UserProfile';

function UserProfilePage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IInteractedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    snapshotApi
      .get<IInteractedUser>(`users/${id}`)
      .then(setUser)
      .catch((err) => console.error('Помилка завантаження користувача:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Завантаження профілю...</p>;
  }

  if (!user) {
    return <p>Користувача не знайдено.</p>;
  }

  return <UserProfile user={user} />;
}

export default UserProfilePage;
