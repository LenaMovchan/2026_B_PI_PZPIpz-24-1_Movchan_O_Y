import { useState } from 'react';

import SettingsChangePassword from './ChangePassword/SettingsChangePassword';
import SettingsDeleteAccount from './DeleteAccount/SettingsDeleteAccount';
import MenuComponent from './MenuComponent';
import UserSettingsNotification from './SettingsNotification/UserSettingsNotification';
import SkillCard from './SkillCard/SkillCard';
import UserInfoCard from './UserInfoCard/UserInfoCard';
import styles from './UserProfileNavigator.module.scss';

function UserProfileNavigator(): React.JSX.Element {
  const [activeMenu, setActiveMenu] = useState('personal');
  const handleMenuClick = (menu: string):void => {
    setActiveMenu(menu);
  };

  return (
   
    <div className={styles.main_settings_container}>
      <MenuComponent onClick={handleMenuClick} activeMenu={activeMenu} />
      <div className={styles.content}>
        {activeMenu === 'personal' && (
          <div>
            <UserInfoCard />
          </div>
        )}
        {activeMenu === 'skills' && (
          <div>
            <SkillCard />
          </div>
        )}
        {activeMenu === 'notifications' && (
          <div>
            <UserSettingsNotification />
          </div>
        )}
        {activeMenu === 'changePassword' && (
          <div>
            <SettingsChangePassword />
          </div>
        )}
        {activeMenu === 'deleteAccount' && (
          <div>
            <SettingsDeleteAccount />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfileNavigator;