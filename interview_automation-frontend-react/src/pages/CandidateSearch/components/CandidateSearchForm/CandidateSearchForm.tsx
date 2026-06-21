import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import snapshotApi from '../../../../api/request';
import AutocompleteInput from '../../../../components/AutocompleteInput/AutocompleteInput';
import CandidateSearchFormProps from '../../../../models/candidateSearch/CandidateSearchProps';
import styles from './CandidateSearchForm.module.scss';
import SkillChip from './SkillChip';
import SkillFormItem from './SkillFormItem';

function CandidateSearchForm({
  setFormData,
  formData,
  handleSubmit
}: CandidateSearchFormProps): JSX.Element {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [lowerSkills, setLowerSkills] = useState<{ name: string, title: string }[]>([]);
  const [selectOptions, setSelectOptions] = useState<{ name: string, title: string }[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const endOfSlice = isExpanded ? selectOptions.length : 8;

  useEffect(() => {
    const getLowerSkills = async (): Promise<void> => {
      const response: { name: string, title: string }[] = await snapshotApi.get('/skills/lower-level');

      setLowerSkills(response);
      setSelectOptions(response);
    };

    getLowerSkills();
  }, []);

  const getSelectedVal = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { id } = e.currentTarget;

    if (selectedSkills.length < 7 && id) {
      if (selectedSkills.includes(id)) toast.warn('Такий скіл уже додано');
      else setSelectedSkills((prev) => [...prev, id]);
    } else toast.warn('Можна додати лише 7 скілів');
  };

  const handleFindSkill = (skill: string): void => {
    setSelectOptions(
      lowerSkills.filter((i) => i.name.toLowerCase().startsWith(skill.toLowerCase()))
    );
  };

  const handleDeleteSkill = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { id } = e.currentTarget;

    if (id) {
      const newSelectedSkills = selectedSkills.filter((item) => item !== id);
      setSelectedSkills(newSelectedSkills);
      setFormData((prev)=>prev.filter((item)=>item.skill !== id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    const existingSkillIndex = formData.findIndex(
      (item) => item.skill === name
    );

    if (existingSkillIndex !== -1) {
      setFormData((prev) => {
        const updatedFormData = [...prev];
        updatedFormData[existingSkillIndex] = {
          ...updatedFormData[existingSkillIndex],
          grade: value
        };

        return updatedFormData;
      });
    } else {
      setFormData((prev) => [
        ...prev,
        {
          skill: name,
          grade: value
        }
      ]);
    }
  };

  return (
    <div className={styles.candidateSearchInput}>
      <AutocompleteInput pholder="Пошук скілів" onChange={handleFindSkill} />
      <h3 style={{ alignSelf: 'start' }}>
        Оберіть навички кандидата (максимум 7):
      </h3>
      <div className={styles.skillsBlock}>
        <div className={styles.skillsWrapper}>
          {[...selectOptions.sort()].slice(0, endOfSlice).map((skill) => (
            <SkillChip skill={skill.name.length > 20 ? skill.title : skill.name }
              tooltip={skill.name}  getSelectedVal={getSelectedVal} selectedSkills={selectedSkills}/>
          ))}
        </div>
        <div className={styles.chevronWrapper}>
          <div
            aria-label="expand-skill-block"
            className={styles.chevron}
            style={{ transform: `rotate(${isExpanded ? '-135deg' : '45deg'})` }}
            role="button"
            tabIndex={0}
            onClick={(): void => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>
      {selectedSkills.length > 0 && <form className={styles.skillForm} onSubmit={handleSubmit}>
        {selectedSkills.map((value, index) => (
          <SkillFormItem value={value} index={index} handleDeleteSkill={handleDeleteSkill} handleChange={handleChange}/>
        ))}
        <button className={styles.primaryButton} type="submit">
          Знайти
        </button>
      </form>}
    </div>
  );
}

export default CandidateSearchForm;
