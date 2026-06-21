// import React, { useEffect, useState } from 'react';
// import snapshotApi from '../../api/request';
// import ICandidateSearch from '../../models/candidateSearch/ICandidateSearch';
// import CandidatePreview from '../CandidateSearch/components/CandidatePreview/CandidatePreview';
// import styles from './CandidateSearch.module.scss';

// function AllCandidates(): JSX.Element {
//   const [candidates, setCandidates] = useState<ICandidateSearch[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await snapshotApi.get<ICandidateSearch[]>(
//           'users/all-candidates'
//         );
//         setCandidates(response ?? []);
//       } catch (err) {
//         console.error('Помилка завантаження кандидатів:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCandidates();
//   }, []);

//   return (
//     <section className={styles.candidateSearchPage}>
//       <h2>Усі кандидати</h2>

//       {loading ? (
//         <p>Завантаження...</p>
//       ) : candidates.length === 0 ? (
//         <p>Кандидати відсутні.</p>
//       ) : (
//         <div className={styles.candidatePreviews}>
//           {candidates.map((candidate) => (
//             <CandidatePreview key={candidate.id} {...candidate} />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

// export default AllCandidates;
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import snapshotApi from '../../api/request';
import ICandidateSearch from '../../models/candidateSearch/ICandidateSearch';
import CandidatePreview from '../CandidateSearch/components/CandidatePreview/CandidatePreview';
import styles from './CandidateSearchAll.module.scss';

// Імпортуємо іконку (наприклад, з react-icons) або використовуємо текстовий символ
const SortIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 5L6 10L1 5" />
    <path d="M6 19V10" />
    <path d="M13 19l5-5 5 5" />
    <path d="M18 5v14" />
  </svg>
);

function AllCandidates(): JSX.Element {
  const [candidates, setCandidates] = useState<ICandidateSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Стан сортування
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await snapshotApi.get<ICandidateSearch[]>(
          'users/all-candidates'
        );
        setCandidates(response ?? []);
      } catch (err) {
        console.error('Помилка завантаження кандидатів:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Функція сортування
  const sortedCandidates = useMemo(() => {
    const result = [...candidates];
    result.sort((a, b) => {
      const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
      const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
      if (sortOrder === 'asc') return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
    return result;
  }, [candidates, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <section className={styles.candidateSearchPage}>
      <header className={styles.pageHeader}>
        <h2>Усі кандидати</h2>
        <button
          className={styles.sortBtn}
          onClick={toggleSort}
          title="Сортувати за ім'ям"
        >
          <SortIcon />
          <span>{sortOrder === 'asc' ? 'А-Я' : 'Я-А'}</span>
        </button>
      </header>

      {loading ? (
        <div className={styles.loader}>Завантаження...</div>
      ) : sortedCandidates.length === 0 ? (
        <p className={styles.emptyMessage}>Кандидати відсутні.</p>
      ) : (
        <div className={styles.candidateList}>
          {sortedCandidates.map((candidate) => (
            <div key={candidate.id} className={styles.candidateRow}>
              <div className={styles.previewWrapper}>
                <CandidatePreview {...candidate} />
              </div>
              <button
                className={styles.viewProfileBtn}
                onClick={() => navigate(`/profile/${candidate.id}`)}
              >
                Переглянути профіль
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AllCandidates;
