import closeIcon from '../../../../assets/icon-close.svg';
import styles from './CandidateSearchForm.module.scss';
import StarInput from './StarInput';

type SkillFormItemProps = {
  value: string,
  index: number,
  handleDeleteSkill: (e: React.MouseEvent<HTMLDivElement>) => void,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

function SkillFormItem({ value, index, handleDeleteSkill, handleChange }: SkillFormItemProps): JSX.Element {
  return <div className={styles.skillFormItem} key={value}>
    <label>
      {`${index + 1} ${value}`}
      <StarInput value={value} handleChange={handleChange}/>
    </label>
    <div
      role="button"
      tabIndex={0}
      id={value}
      onClick={handleDeleteSkill}
    >
      <img src={closeIcon} alt="delete" width={20} height={20} />
    </div>
  </div>;
}

export default SkillFormItem;
