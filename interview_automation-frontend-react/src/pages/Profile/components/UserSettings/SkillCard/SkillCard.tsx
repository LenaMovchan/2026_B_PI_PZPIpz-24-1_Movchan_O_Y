import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { ISkills } from '../../../../../models/profile/ISkills';
import { IRoles } from '../../../../../models/user/IRoles';
import { getUserSkillsByRole } from '../../../../../store/reducers/skills/actions';
import { removeSkill } from '../../../../../store/reducers/skills/userSkillsSlice';
import UserRoles from '../../Roles/UserRoles';
import Skills from '../../Skills/Skills';
import styles from './SkillCard.module.scss';

function SkillCard(): React.JSX.Element {
  const user = useAppSelector((state) => state.user.userData);
  const [selectedRole, setSelectedRole] = useState<IRoles | null>(null);
  const [showNewComponent, setShowNewComponent] = useState(false);
  const dispatch = useAppDispatch();
  const [buttonVisible, setButtonVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { userSkills } = useAppSelector((state) => state.userSkills);

  useEffect(() => {
    if (selectedRole) {
      dispatch(getUserSkillsByRole({ userId:user.id, roleId:selectedRole.id }));
    }
  }, [dispatch,selectedRole, user.id]);

  const handleButtonClick = (): void => {
    if (selectedRole) {
      setShowNewComponent((prevShowNewComponent) => !prevShowNewComponent);
      setButtonVisible(false);

    } else {
      alert('Будь ласка, виберіть роль перед додаванням навичок.');
    }
  };
  const visibleSkills = isExpanded ? userSkills : userSkills.slice(0, 10);

  const handleSkillRemove = async (skill: ISkills):Promise<void> => {
    dispatch(removeSkill(skill));
  };

  return (
    <div className={styles.main_skill_settings_container}>
      <div className={styles.roleSelectionContainer}>
        {/* <UserRoles /> */}
        <UserRoles setSelectedRole={setSelectedRole} />
      </div>

      <div  className={styles.main_skill_settings_exist}>
        <div
          aria-label="expand-skill-block"
          className={styles.chevron}
          style={{ transform: `rotate(${isExpanded ? '-135deg' : '45deg'})` }}
          role="button"
          tabIndex={0}

          onClick={(): void => setIsExpanded(!isExpanded)}
          onKeyDown={(event): void => {
            if (event.key === 'Enter' || event.key === ' ') {
              setIsExpanded(!isExpanded);
            }
          }}
        />

        {visibleSkills.map((skill) => (
          <div
            key={skill.name}
            className={`${styles.skillChip}
            ${styles.existingSkill}`}>
            {skill.name}
            <span
              className={styles.closeIcon}
              role="button"
              tabIndex={0}
              onClick={() => handleSkillRemove(skill)}
            >
              &times;
            </span>
          </div>
        ))}

      </div>

      <div className={styles.main_skill_settings}>
        <div className={styles.main_skill_settings_title}>Мої навички</div>
        {showNewComponent && selectedRole && (
          <Skills roleId={selectedRole.id}  />
        )}
        <button
          type="button"
          className={styles.submitButtonSkill}
          onClick={handleButtonClick}
          style={{ display: buttonVisible ? 'block' : 'none' }} >
          ДОДАТИ НАВИЧКИ
        </button>
      </div>
    </div>
  );
}

export default SkillCard;

