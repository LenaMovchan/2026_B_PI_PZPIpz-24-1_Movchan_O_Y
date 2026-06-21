import React, { useState } from 'react';
import snapshotApi from '../../api/request';
import ICandidateSearch from '../../models/candidateSearch/ICandidateSearch';
import CandidatePreview from '../CandidateSearch/components/CandidatePreview/CandidatePreview';
import styles from './CandidateSearchByEmail.module.scss';
import { useNavigate } from 'react-router-dom';
export interface NameSearchFormProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const NameSearchForm = ({
  searchTerm,
  setSearchTerm,
  handleSubmit
}: NameSearchFormProps) => (
  <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
    <input
      type="text"
      placeholder="Введіть прізвище кандидата"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ padding: '10px', flexGrow: 1 }}
    />
    <button type="submit" style={{ padding: '10px 20px' }}>
      Шукати
    </button>
  </form>
);

function CandidateSearch(): JSX.Element {
  const navigate = useNavigate();
  const [userPreview, setUserPreview] = useState<ICandidateSearch | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false); // 💡 Чи був виконаний пошук

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const term = searchTerm.trim();
    setUserPreview(null);

    if (term) {
      setIsSearching(true);
      setSearchPerformed(true);
      try {
        const response: ICandidateSearch | null = await snapshotApi.get(
          `users/by-lastname?lastname=${encodeURIComponent(term)}`
        );
        console.log('API Response Type:', typeof response);
        console.log('API Response Content:', response);

        if (response) {
          setUserPreview(response);
        } else {
          setUserPreview(null);
        }
      } catch (error) {
        console.error('Помилка при пошуку кандидата:', error);
        setUserPreview(null);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <section className={styles.candidateSearchPage}>
      <div className={styles.candidateSearchRow}>
        <NameSearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSubmit={handleSubmit}
        />

        <div className={styles.candidatePreviews}>
          {isSearching ? (
            <p>Пошук кандидата...</p>
          ) : userPreview ? (
            // ✅ КОНТЕЙНЕР ДЛЯ ПРОФІЛЮ ТА КНОПКИ
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
              {/* 1. Рендеринг ЗНАЙДЕНОГО кандидата */}
              <CandidatePreview key={userPreview.id} {...userPreview} />

              {/* 2. ✅ КНОПКА ПЕРЕГЛЯДУ ПРОФІЛЮ */}
              {/* <button
                onClick={() => {
                  // 💡 ЗАГЛУШКА: Замініть цей код на реальну логіку переходу (наприклад, history.push(`/profile/${userPreview.id}`))
                  console.log(
                    `Перегляд профілю кандидата ID: ${userPreview.id}`
                  );
                  alert(`Перехід до профілю: ${userPreview.id}`);
                }}
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
              </button> */}
              <button
                onClick={() => navigate(`/profile/${userPreview.id}`)}
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
          ) : searchPerformed && searchTerm.trim() ? (
            <p>Кандидат за прізвищем "{searchTerm.trim()}" не знайдений.</p>
          ) : (
            <p>Введіть прізвище для пошуку.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CandidateSearch;
