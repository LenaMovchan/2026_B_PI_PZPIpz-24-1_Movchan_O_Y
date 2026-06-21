import React, { useState } from 'react';
import snapshotApi from '../../api/request';
import styles from './Statistics.module.scss';

interface InterviewerStat {
  firstName: string;
  lastName: string;
  interviewCount: number;
}

const InterviewerStatistics = () => {
  const [dates, setDates] = useState({ from: '', to: '' });
  const [data, setData] = useState<InterviewerStat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStatistics = async () => {
    if (!dates.from || !dates.to) {
      alert('Будь ласка, оберіть період');
      return;
    }
    setLoading(true);
    try {
      const response = await snapshotApi.get('/interviews/interviewers', {
        params: dates
      });
      // Обробка відповіді залежно від конфігурації axios
      const result = response.data || response;
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error loading stats', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.stats_container}>
      <h3>Статистика активності інтерв'юерів</h3>

      <div className={styles.filter_panel}>
        <div className={styles.input_group}>
          <label>З:</label>
          <input
            type="date"
            onChange={(e) => setDates({ ...dates, from: e.target.value })}
          />
        </div>
        <div className={styles.input_group}>
          <label>По:</label>
          <input
            type="date"
            onChange={(e) => setDates({ ...dates, to: e.target.value })}
          />
        </div>
        <button onClick={fetchStatistics} className={styles.btn_load}>
          Сформувати звіт
        </button>
      </div>

      {loading ? (
        <p>Обробка даних...</p>
      ) : (
        <table className={styles.stats_table}>
          <thead>
            <tr>
              <th>Інтерв'юер</th>
              <th>Кількість проведених інтерв'ю</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.interviewCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center' }}>
                  Дані відсутні за цей період
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InterviewerStatistics;
