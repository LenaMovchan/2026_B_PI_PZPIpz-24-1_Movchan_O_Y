/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { useState } from 'react';

import styles from './CandidateSearchForm.module.scss';

type SkillChipProps = {
  skill: string,
  tooltip: string,
  getSelectedVal: (e: React.MouseEvent<HTMLDivElement>) => void
  selectedSkills: string[]
};

function SkillChip({ skill, tooltip, getSelectedVal, selectedSkills }: SkillChipProps): JSX.Element {
  const [chipHovered, setChipHovered] = useState(false);

  return <div
    key={skill}
    role="button"
    tabIndex={0}
    style={{ backgroundColor: `${selectedSkills.includes(skill) ? '#8de3db' : '#c2cae8'}` }}
    className={styles.skillChip}
    id={skill}
    onClick={getSelectedVal}
    onMouseOver={(): void => setChipHovered(true)}
    onMouseLeave={(): void => setChipHovered(false)}
  >
    {chipHovered && <div className={styles.tooltip}>
      <p>{tooltip}</p>
    </div>}
    {skill}
  </div>;
}

export default SkillChip;
