import React, { useState } from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import UserSkill from '../../../Profile/components/UserSkills/UserSkill';
import styles from './InterviewSkills.module.scss';

interface InterviewSkillsProps{
  onClick?:(e:number)=>void
}

function InterviewSkills({ onClick = (): void => {} }:Readonly<InterviewSkillsProps>): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const  { sharedSkills } = useAppSelector((state) => state.interview);

  return (
    <section className={styles.skillsContainer}>
      <div className={styles.skillsSubContainer}
        style={{
          maxHeight:`${isExpanded?'10rem':'3rem'}`,
          overflowY:`${isExpanded?'scroll':'hidden'}`
        }}>
        <button
          type="button"
          onClick={() =>
            setIsExpanded(!isExpanded)}
          className={styles.toggleButton}

        >
          {isExpanded
            ? <svg className={styles.arrowUp}>{'>'}</svg>
            : <svg className={styles.arrowDown}>{'>'}</svg>}
        </button>
        {sharedSkills.map((skill) => (
          <UserSkill skills={skill} key={skill.id} mainBG="rgb(15 23 41 / 20%)" onClick={onClick}/>
        ))}
      </div>
    </section>
  );
}

export default InterviewSkills;
