import classNames from 'classnames';
import { useEffect, useState } from 'react';

import snapshotApi from '../../api/request';
import iconF from '../../assets/icon-f.svg';
import iconIn from '../../assets/icon-in.svg';
import iconTv from '../../assets/icon-tv.svg';
import styles from './Footer.module.scss';

function Footer(): React.JSX.Element {
  const [version, setVersion] = useState('');

  useEffect(() => {
    const getVersion = async (): Promise<void> => {
      const response: string = await snapshotApi.get('/version');
      setVersion(response);
    };

    getVersion();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_linksContainer}>
        <div className={classNames(styles.footer_link, styles.footer_link_hr)}>
          HR
        </div>
        {/* <div className={styles.footer_link}>Співбесіда</div>
        <div className={styles.footer_link}>Довідник скілів</div> */}
      </div>
      <div className={styles.footer_social_copyright}>
        <div>
          {version && (
            <span className={styles.footer_num_version}> v{version}</span>
          )}
          <span className={styles.footer_copyright_name_project}>
            ІНТЕРВ'Ю IT
          </span>
        </div>
        <div className={styles.footer_socialMediaLinks}>
          <img src={iconF} alt="Facebook icon" />
          <img src={iconTv} alt="Twitter icon" />
          <img src={iconIn} alt="LinkedIn icon" />
        </div>
        <div>© 2025. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
