import { TreeItem } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { ISkills } from '../../../../models/profile/ISkills';
import { addRoleSkills, getRoleSkills } from '../../../../store/reducers/skills/actions';
import { addUserSkill, getFilterSkillsByInput } from '../../../../store/reducers/skills/userSkillsSlice';
import { RootState } from '../../../../store/store';
import styles from './Skills.module.scss';

interface SkillsProps {
  roleId: number;

}
export default function Skills({ roleId }: SkillsProps): React.JSX.Element {

  const [selectedSkillsId, setSelectedSkillsId] = useState<number[]>([]);
  const [selectedSkillsNames, setSelectedSkillsNames] = useState<string[]>([]);
  const { allSkills,userSkills,allLowLevelSkills }
    = useAppSelector((state: RootState) => state.userSkills);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(false);

  useEffect(() => {
    dispatch(getRoleSkills(roleId));
  }, [dispatch, roleId]);

  useEffect(() => {
    dispatch(getFilterSkillsByInput(inputValue));
  }, [dispatch, inputValue]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
    setIsInputEmpty(Boolean(event.target.value));
  };

  const handleSkillClick = (skill:ISkills): void => {
    if (!selectedSkillsId.includes(skill.id)) {
      setSelectedSkillsId([...selectedSkillsId, skill.id]);
      setSelectedSkillsNames( [...selectedSkillsNames, skill.name]);
      dispatch(addUserSkill(skill));
    }
  };

  const onSubmit = async ():Promise<void> => {
    const skillIds = userSkills.map((skill)=>skill.id);
    dispatch(addRoleSkills({ roleId, skillIds }));
  };

  const renderTreeItems = (skill: ISkills[]): React.JSX.Element => (
    <SimpleTreeView className={styles.skillsContainer}>
      {skill && skill.map((skill_) => (
        !userSkills.some((userSkill) => userSkill.id === skill_.id) && (
          <TreeItem
            className={styles.treeItem}
            key={`${skill_.id}t`}
            itemId={skill_.id.toString()}
            label={skill_.name}
            onClick={skill_.children.length > 0 ? ():null => null : (): void => handleSkillClick(skill_)}
          >
            {skill_.children.length > 0 && renderTreeItems(skill_.children)}
          </TreeItem>
        )
      ))}
    </SimpleTreeView>
  );

  const renderFilteredItems = ():React.JSX.Element => (
    <div className={styles.filteredSkillsContainer}>
      {allLowLevelSkills.map((skill_) => (
        skill_.name.toLowerCase().includes(inputValue.toLowerCase())&&(
          !userSkills.some((userSkill) => userSkill.id === skill_.id) && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleSkillClick(skill_)}
              key={skill_.id}
            >
              {skill_.name}
            </div>
          )
        ))
      )}
    </div>
  );

  return (
    <div className={styles.container}>

      {/* <h3>Оберіть навички:</h3> */}
      <div>
        <input
          className={styles.input}
          type="text"
          value={inputValue}
          placeholder="Почніть вводити назву навички..."
          onChange={onInputChange}
        />
      </div>
      <div />
      <div>
        {isInputEmpty ? renderFilteredItems() : renderTreeItems(allSkills)}
      </div>
      <button type="button" onClick={onSubmit} className={styles.submitButtonSkill}>
        Підтвердити
      </button>
    </div>
  );
}
