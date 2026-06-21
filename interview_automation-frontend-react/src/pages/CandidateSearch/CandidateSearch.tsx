import { useState } from 'react';

import snapshotApi from '../../api/request';
import { Criteria } from '../../models/candidateSearch/CandidateSearchProps';
import ICandidateSearch from '../../models/candidateSearch/ICandidateSearch';
import styles from './CandidateSearch.module.scss';
import CandidatePreview from './components/CandidatePreview/CandidatePreview';
import CandidateSearchForm from './components/CandidateSearchForm/CandidateSearchForm';

function CandidateSearch(): JSX.Element {
  const [userPreviews, setUserPreviews] = useState<ICandidateSearch[]>();
  const [formData, setFormData] = useState<Criteria[]>([]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (formData.length > 0) {
      const response: ICandidateSearch[] = await snapshotApi.post(
        'users/by-skills-and-grades',
        formData
      );

      if (response) setUserPreviews(response);
    }
  };

  return (
    <section className={styles.candidateSearchPage}>
      <div className={styles.candidateSearchRow}>
        <CandidateSearchForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
        <div className={styles.candidatePreviews}>
          {userPreviews &&
            userPreviews.map((preview) => (
              <CandidatePreview key={preview.id} {...preview} />
            ))}
        </div>
      </div>
    </section>
  );
}

export default CandidateSearch;
