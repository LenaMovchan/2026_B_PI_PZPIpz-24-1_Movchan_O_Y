import React, { useState } from 'react';
import snapshotApi from '../../api/request';
import styles from './Statistics.module.scss';

interface SkillCoverage {
  interviewId: number;
  interviewTitle: string;
  evaluatedCount: number;
  evaluatedSkills: string[];
  expectedCount: number;
  missingSkills: string[];
}

const SkillCoverageStats = () => {
  const [dates, setDates] = useState({ from: '', to: '' });
  const [data, setData] = useState<SkillCoverage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!dates.from || !dates.to) return alert('Оберіть період');
    setLoading(true);
    try {
      const response = await snapshotApi.get('/skills/skills-coverage', {
        params: dates
      });
      setData(response.data || response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.stats_container}>
      <h3>Аналіз покриття навичок в інтерв'ю</h3>

      <div className={styles.filter_panel}>
        <input
          type="date"
          onChange={(e) => setDates({ ...dates, from: e.target.value })}
        />
        <input
          type="date"
          onChange={(e) => setDates({ ...dates, to: e.target.value })}
        />
        <button onClick={handleFetch} className={styles.btn_load}>
          Аналізувати
        </button>
      </div>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table className={styles.stats_table}>
          <thead>
            <tr>
              <th>Інтерв'ю</th>
              <th>Оцінено</th>
              <th>Очікувалось</th>
              <th>Пропущені навички (Missing)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.interviewId}>
                <td>
                  <strong>{item.interviewTitle}</strong>
                </td>
                <td>
                  <span className={styles.badge_eval}>
                    {item.evaluatedCount}
                  </span>
                  <small>{item.evaluatedSkills.join(', ')}</small>
                </td>
                <td>{item.expectedCount}</td>
                <td>
                  {item.missingSkills.length > 0 ? (
                    <span className={styles.text_danger}>
                      {item.missingSkills.join(', ')}
                    </span>
                  ) : (
                    <span className={styles.text_success}>Повне покриття</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SkillCoverageStats;
