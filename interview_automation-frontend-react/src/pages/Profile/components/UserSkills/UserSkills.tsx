import React from 'react';

import { IRoles } from '../../../../models/user/IRoles';
import { flattenSkillsHierarchy } from '../../../../utils/interview/calculateAndSortSharedSkills';
import SkillBlock from './SkillBlock';
import styles from './UserSkills.module.scss';

function UserSkills({ roles }: { roles: IRoles[] }): React.JSX.Element {

  return (
    <section className={styles.userSkills}>
      <h3>Мої навички</h3>
      {
        roles.map((role) => (
          <div key={role.id}>
            <h3>{role.name}:</h3>
            <div className={`${styles.skillBlock} ${styles.blockBorder}`}>
              <SkillBlock skills={flattenSkillsHierarchy(role.skills) } />
            </div>
          </div>
        )
        )
      }
    </section>
  );
}

export default UserSkills;
