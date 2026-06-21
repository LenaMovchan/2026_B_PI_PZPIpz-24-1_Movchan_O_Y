import React from 'react';

import { ISkills } from '../../../../models/profile/ISkills';
import styles from './UserSkills.module.scss';

interface UserSkillProp {
  skills: ISkills;
  mainBG: string;
  onClick?: (num: number) => void;
}

function UserSkill({ skills,mainBG, onClick = (): void => {} }:  Readonly<UserSkillProp>): React.JSX.Element {
  const { shared, name, id } = skills;

  return (
    <button
      type="button"
      style={{ background:`${mainBG}` }}
      className={shared ?`${styles.skillItem} ${styles.shared}` :styles.skillItem}
      onClick={shared ? (): void => onClick(id) : (): null => null}
    >
      {name}
    </button>
  );
}

export default UserSkill;

