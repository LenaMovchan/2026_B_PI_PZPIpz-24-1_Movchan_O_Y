import classNames from 'classnames';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteUser } from '../../store/reducers/user/userSlice';
import useForce from '../../utils/useForce';
import styles from './Header.module.scss';
import Notification from './Notification';
import downloadTechnicalExcelReport from './ReportEx';
import TechnicalReportModal from './TechnicalReportModal';

function HeaderAccount(): React.JSX.Element {
  const user = useAppSelector((state) => state.user.userData);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useForce(location);

  return (
    <header className={styles.header}>
      <div className={styles.header_top}>
        <div className={styles.header_top_location}>Україна</div>

        <div className={styles.header_top_user}>
          {user.firstname}
          <div className={styles.drop_down_profile}>
            <div className={styles.header_user_drpop_down_menu}>
              <Link
                className={classNames(
                  styles.header_top_user,
                  styles.header_top_user_hover,
                  styles.header_user_drpop_down_link,
                  styles.header_user_drpop_down_user
                )}
                to={`/profile/${user.id}`}
              >
                Мій профіль
              </Link>
              <Link
                className={styles.header_user_drpop_down_link}
                to={`/profile/${user.id}/settings`}
              >
                Налаштувати профіль
              </Link>
              <button
                type="button"
                className={classNames(
                  styles.header_user_drpop_down_link,
                  styles.header_user_drpop_down_exit
                )}
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refresh_token');
                  dispatch(deleteUser());
                  navigate('/');
                }}
              >
                Вийти
              </button>
              {/* <Link
                className={classNames(styles.header_user_drpop_down_link, styles.header_user_drpop_down_exit)}
                to="/sign-in"
              >
                Вийти
              </Link> */}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.header_title_notification}>
        <div className={styles.header_title}>
          <Link to="/">ІНТЕРВ'Ю IT</Link>
        </div>
        <div>
          <div className={styles.header_title_notification}>
            {Boolean(user.id) && <Notification />}
          </div>
          {/* <div><Link className={styles.header_link} to={}></Link></div> */}
        </div>
      </div>

      <div className={styles.header_linksContainer}>
        <div>
          <Link
            className={styles.header_link}
            to={`/profile/${user.id}/my_statistics`}
          >
            Моя статистика
          </Link>
          {/* <Link
            className={styles.header_link}
            to={`/profile/${user.id}/statistics`}
          >
            Статистика інтерв’юерів
          </Link>
        </div> */}
          {/* Випадаюче меню для статистики */}
          <div className={styles.stats_dropdown_wrapper}>
            <span className={styles.header_link}>Статистика та аналітика</span>
            <div className={styles.stats_dropdown_menu}>
              <Link to={`/profile/statistics`} className={styles.dropdown_item}>
                Статистика інтерв'юерів за період
              </Link>
              <Link
                to={`/profile/skills-compliance`}
                className={styles.dropdown_item}
              >
                Рівень відповідності по навичках
              </Link>
              <Link
                to={`/profile/skills-coverage`}
                className={styles.dropdown_item}
              >
                Рівень покриття навичок в інтерв'ю
              </Link>
              <Link
                to={`/profile/most-checked-skills`}
                className={styles.dropdown_item}
              >
                Найпопулярніші навички (Рік/Місяць)
              </Link>
              <div className={styles.stats_dropdown_menu}>
                {/* Ваші існуючі Link... */}

                <div
                  className={styles.dropdown_item}
                  style={{
                    cursor: 'pointer',
                    color: '#16a34a',
                    fontWeight: 'bold'
                  }}
                  onClick={() => setIsReportModalOpen(true)}
                >
                  📊 Звіт про технічний рівень (Excel)
                </div>

                {/* Рендеримо модалку, якщо стан true */}
                {isReportModalOpen && (
                  <TechnicalReportModal
                    onClose={() => setIsReportModalOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.search_dropdown_wrapper}>
          <span className={styles.header_link}>Пошук кандидатів</span>

          <div className={styles.search_dropdown_menu}>
            <Link to="/candidate-search" className={styles.dropdown_item}>
              Знайти кандидата за навичками
            </Link>

            <Link to="/by-lastname" className={styles.dropdown_item}>
              Знайти кандидата за прізвищем
            </Link>

            <Link to="/by-email" className={styles.dropdown_item}>
              Знайти інтервʼю кандидата за електронною поштою
            </Link>
            <Link to="/all-candidates" className={styles.dropdown_item}>
              Знайти всіх кандидатів
            </Link>
          </div>
        </div>

        {/* <div>
          <Link className={styles.header_link} to="/candidate-search">
            Знайти кандидата за навичками
          </Link>
        </div>
        <div>
          <Link className={styles.header_link} to="/by-lastname">
            Знайти кандидата за прізвищем
          </Link>
        </div> */}
      </div>
    </header>
  );
}

export default HeaderAccount;
