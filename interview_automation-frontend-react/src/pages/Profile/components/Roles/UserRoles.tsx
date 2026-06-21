import React, { useEffect, useState } from 'react';

import snapshotApi from '../../../../api/request';
import { IRoles } from '../../../../models/user/IRoles';
import styles from './UserRoles.module.scss';

interface UserRolesProps {
  setSelectedRole: React.Dispatch<React.SetStateAction<IRoles | null>>;
}

export default function UserRoles({ setSelectedRole }: UserRolesProps): React.JSX.Element {
  const [userRoles, setUserRoles] = useState<IRoles[]>([]);

  // const handleOnClick = (selectedRole: IRoles): void => {
  //   setSelectedRole(selectedRole);
  // };

  useEffect(() => {
    (async (): Promise<void> => {
      const response: IRoles[] = await snapshotApi.get('users/all-roles');
      setUserRoles(response.filter((role) => role.name !== 'HR'));
    })();
  }, []);

  if (!userRoles) return <>loading...</>;

  return (
    <div className={styles.userProfileContainer}>
      {/* {!selectedRole ? ( */}
      <div className={styles.rolesContainer}>
        <div className={styles.main_role_settings_title}>Виберіть вашу роль:</div>
        {userRoles.map((role: IRoles) => (
          <label key={role.id}>
            {role.name !== 'ADMIN' && (
              <>
                <input
                  type="radio"
                  name="preference"
                  value={role.name}
                  onClick={() => setSelectedRole(role)}
                />
                {role.name}
              </>
            )}
          </label>
        ))}
      </div>
      {/* ) : ( */}
      {/* <div className={styles.selectedRoleContainer}>
          Вибрана роль:
          <p>{selectedRole.name}</p>
        </div> */}
      {/* )} */}
    </div>
  );
}

