import styles from './AutocompleteInput.module.scss';

type AutocompleteInputProps = {
  pholder: string;
  onChange: (skill: string) => void;
};

function AutocompleteInput({
  pholder,
  onChange
}: AutocompleteInputProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    onChange(input);
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        aria-label="candidate-search"
        className={styles.candidateInput}
        id="tag-input"
        placeholder={pholder}
        type="search"
        onChange={handleChange}
      />
      <div
        style={{
          display: 'flex',
          width: '75px',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <div className={styles.filter}>
          <div className={styles.bar1} />
          <div className={styles.bar2} />
          <div className={styles.bar3} />
        </div>
        Фільтр
      </div>
      <div>
        Сортувати за
        <div className={styles.chevron} />
      </div>
    </div>
  );
}

export default AutocompleteInput;
