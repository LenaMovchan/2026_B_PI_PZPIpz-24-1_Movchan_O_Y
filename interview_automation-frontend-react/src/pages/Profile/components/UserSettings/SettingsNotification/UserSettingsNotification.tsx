
import styles from './UserSettingsNotification.module.scss';

function UserInfoCard(): React.JSX.Element {

  return ( 
    <div className={styles.main_user_settings_notification}>
      <div className={styles.main_user_settings_title_notification}>Параметри сповіщень</div>
      <div className={styles.settings_profileVisibility}>
        <label className={styles.switcher}>
          <input type="checkbox"/>
          <span className={styles.slider}/>
        </label>
        <p>Сповістити про заплановану співбесіду?</p>
        
      </div>
      <div className={styles.settings_profileVisibility}>
        <label className={styles.switcher}>
          <input type="checkbox"/>
          <span className={styles.slider}/>
        </label>
        <p>Сповістити про відгук по завершеному інтерв&apos;ю?</p>
        
      </div>
      
    </div>
  );
}

export default UserInfoCard;