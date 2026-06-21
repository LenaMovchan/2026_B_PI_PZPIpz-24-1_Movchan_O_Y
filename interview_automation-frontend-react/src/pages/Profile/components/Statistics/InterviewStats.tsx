import React, { useState } from 'react';

import InterviewStatsTable from './InterviewStatsTable';
import { InterviewStatisticsDto } from '../../../models/InterviewStatisticsDto';
import snapshotApi from '../../../../api/request';

function InterviewStats(): JSX.Element {
  const [data, setData] = useState<InterviewStatisticsDto[]>([]);
  const [formData, setFormData] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    //snapshotApi.delete('/users')
    try {
      const response = await snapshotApi.get<InterviewStatisticsDto[]>(
        '/interviews/statistics',
        {
          params: {
            startDate: `${formData.from}T00:00:00`,
            endDate: `${formData.to}T23:59:59`
          }
        }
      );
      setData(response.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Помилка під час завантаження статистики:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Статистика інтерв’юерів</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="from">Від:</label>
        <input
          type="date"
          id="from"
          name="from"
          required
          onChange={handleChange}
        />

        <label htmlFor="to">До:</label>
        <input type="date" id="to" name="to" required onChange={handleChange} />

        <button type="submit">Отримати статистику</button>
      </form>

      {loading && <p>Завантаження...</p>}
      {submitted && data.length === 0 && (
        <p>Немає даних для обраного періоду.</p>
      )}
      {data.length > 0 && <InterviewStatsTable data={data} />}
    </div>
  );
}

export default InterviewStats;
