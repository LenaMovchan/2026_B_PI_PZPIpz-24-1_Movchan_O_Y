import React, { useState } from 'react';

import { ISkills } from '../../../../models/profile/ISkills';
import { flattenSkillsHierarchy } from '../../../../utils/interview/calculateAndSortSharedSkills';
import UserSkill from './UserSkill';
import styles from './UserSkills.module.scss';

interface SkillBlockProp {
  skills: ISkills[],
}

function SkillBlock( { skills } : Readonly<SkillBlockProp>): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsExpanded(!isExpanded)} className={styles.toggleButton}>
        {isExpanded
          ? <div className={styles.arrowUp}>{'>'}</div>
          : <div className={styles.arrowDown}>{'>'}</div>}
      </button>
      {flattenSkillsHierarchy(skills).slice(0, 2)?.map((skill) => (
        <UserSkill skills={skill} key={skill.id} mainBG="#c2cae8"/>
      ))}
      {isExpanded && flattenSkillsHierarchy(skills).slice(2).map((skill) => (
        <UserSkill skills={skill} key={skill.id} mainBG="#c2cae8"/>
      ))}
    </>
  );
}

export default SkillBlock;
