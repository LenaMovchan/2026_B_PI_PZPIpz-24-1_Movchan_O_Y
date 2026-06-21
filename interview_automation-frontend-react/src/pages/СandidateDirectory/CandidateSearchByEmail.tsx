import React, { useState } from 'react';
import snapshotApi from '../../api/request';
import ICandidateSearch from '../../models/candidateSearch/ICandidateSearch';
import CandidatePreview from '../CandidateSearch/components/CandidatePreview/CandidatePreview';
import styles from './CandidateSearchByEmail.module.scss';
import { useNavigate } from 'react-router-dom';

function CandidateSearchByEmail(): JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [candidate, setCandidate] = useState<ICandidateSearch | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();

    if (!value) return;

    setCandidate(null);
    setIsSearching(true);
    setSearchPerformed(true);

    try {
      const response = await snapshotApi.get(
        `users/by-email?email=${encodeURIComponent(value)}`
      );
      setCandidate(response ?? null);
    } catch (err) {
      console.error('Помилка пошуку за email:', err);
      setCandidate(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className={styles.candidateSearchPage}>
      <form
        onSubmit={handleSubmit}
        className={styles.searchForm}
        noValidate // ✅ вимикаємо HTML-валідацію
      >
        <input
          type="text" // ✅ приймає будь-які значення
          placeholder="Введіть email або логін кандидата"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Шукати
        </button>
      </form>

      {/* <div className={styles.candidatePreviews}>
        {isSearching ? (
          <p className={styles.infoText}>Пошук кандидата...</p>
        ) : candidate ? (
          <CandidatePreview {...candidate} />
        ) : searchPerformed ? (
          <p className={styles.errorText}>
            Кандидат з ідентифікатором "{email}" не знайдений.
          </p>
        ) : (
          <p className={styles.infoText}>Введіть email або логін для пошуку.</p>
        )}
      </div> */}
      <div className={styles.candidatePreviews}>
        {isSearching ? (
          <p>Пошук...</p>
        ) : candidate ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px'
            }}
          >
            {/* 🔹 Превʼю кандидата */}
            <CandidatePreview {...candidate} />

            {/* 🔹 КНОПКА ПЕРЕГЛЯДУ ПРОФІЛЮ */}
            <button
              onClick={() => navigate(`/profile/${candidate.id}`)}
              style={{
                padding: '10px 15px',
                backgroundColor: '#574997',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                alignSelf: 'center'
              }}
            >
              Переглянути профіль
            </button>
          </div>
        ) : searchPerformed ? (
          <p>Кандидат з ідентифікатором "{email}" не знайдений.</p>
        ) : (
          <p>Введіть email або логін для пошуку.</p>
        )}
      </div>
    </section>
  );
}

export default CandidateSearchByEmail;
