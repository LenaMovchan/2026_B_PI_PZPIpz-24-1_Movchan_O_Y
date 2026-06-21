import classNames from 'classnames';

import firstPagePicture from '../../assets/first-page-picture.svg';
import styles from './Home.module.scss';

function Home(): JSX.Element {
 
  return (
    <div className={styles.main_first_page}>
      <div className={styles.main_first_page_container}>
        <div className={styles.main_first_page_action_container}>
          <div className={styles.main_first_page_action}>
            <div className={styles.main_first_page_action_text}>
              Готові до своєї наступної співбесіди?
            </div> 
            <button type="submit" className={classNames(styles.submitButton, styles.main_first_page_action_button)}>
              СТАРТ НОВОГО ІНТЕРВ&apos;Ю</button> 
          </div>
        </div>
        <div className={styles.main_first_page_image_container}>
          <img src={firstPagePicture} alt="First_page_picture" />
        </div>
      </div>
    </div>
  );
}

export default Home;

