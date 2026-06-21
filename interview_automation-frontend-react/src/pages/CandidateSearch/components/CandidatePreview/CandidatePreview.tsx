import ICandidateSearch from '../../../../models/candidateSearch/ICandidateSearch';
import styles from './CandidatePreview.module.scss';
import TinyPortrait from './TinyPortrait';

function CandidatePreview({
  id,
  firstname,
  lastname,
  skillGrades,
  email
}: ICandidateSearch): JSX.Element {
  return (
    <div id={String(id)} className={styles.candidatePreview}>
      <div>
        <p>{firstname}</p>
        <p>{lastname}</p>
        <p>{email}</p>
      </div>
      <div>
        <TinyPortrait {...skillGrades} />
      </div>
    </div>
  );
}

export default CandidatePreview;
