// import React, { useState } from 'react';
// import snapshotApi from '../../api/request';

// interface SkillCompliance {
//   skillName: string;
//   candidateCount: number;
//   averageGrade: number;
// }

// const SkillComplianceStats = () => {
//   const [dates, setDates] = useState({ from: '', to: '' });
//   const [stats, setStats] = useState<SkillCompliance[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleFetch = async () => {
//     if (!dates.from || !dates.to) return alert('Оберіть обидві дати');

//     setLoading(true);
//     try {
//       const response = await snapshotApi.get('/skills/skills-compliance', {
//         params: dates
//       });
//       setStats(Array.isArray(response.data) ? response.data : response);
//     } catch (error) {
//       console.error('Error fetching compliance stats', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="stats-container">
//       <h3>Рівень відповідності кандидатів за навичками</h3>

//       <div
//         className="filter-panel"
//         style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
//       >
//         <input
//           type="date"
//           onChange={(e) => setDates({ ...dates, from: e.target.value })}
//         />
//         <input
//           type="date"
//           onChange={(e) => setDates({ ...dates, to: e.target.value })}
//         />
//         <button onClick={handleFetch} className="btn-submit">
//           Показати
//         </button>
//       </div>

//       {loading ? (
//         <p>Завантаження...</p>
//       ) : (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Назва навички</th>
//               <th>Кількість кандидатів</th>
//               <th>Середня оцінка (0-100)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stats.map((row, index) => (
//               <tr key={index}>
//                 <td>{row.skillName}</td>
//                 <td>{row.candidateCount}</td>
//                 <td>{row.averageGrade?.toFixed(2) || '0.00'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default SkillComplianceStats;
import React, { useState } from 'react';
import snapshotApi from '../../api/request';
import styles from './Statistics.module.scss'; // Переконайтеся, що шлях вірний

interface SkillCompliance {
  skillName: string;
  candidateCount: number;
  averageGrade: number;
}

const SkillComplianceStats = () => {
  const [dates, setDates] = useState({ from: '', to: '' });
  const [stats, setStats] = useState<SkillCompliance[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!dates.from || !dates.to) return alert('Оберіть обидві дати');

    setLoading(true);
    try {
      const response = await snapshotApi.get('/skills/skills-compliance', {
        params: dates
      });
      setStats(Array.isArray(response.data) ? response.data : response);
    } catch (error) {
      console.error('Error fetching compliance stats', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.stats_container}>
      <h3>Рівень відповідності кандидатів за навичками</h3>

      <div className={styles.filter_panel}>
        <div className={styles.input_group}>
          <label>Дата з:</label>
          <input
            type="date"
            onChange={(e) => setDates({ ...dates, from: e.target.value })}
          />
        </div>
        <div className={styles.input_group}>
          <label>Дата по:</label>
          <input
            type="date"
            onChange={(e) => setDates({ ...dates, to: e.target.value })}
          />
        </div>
        <button onClick={handleFetch} className={styles.btn_load}>
          Показати
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>Завантаження...</div>
      ) : (
        <table className={styles.stats_table}>
          <thead>
            <tr>
              <th>Назва навички</th>
              <th>Кількість кандидатів</th>
              <th>Середня оцінка (0-100)</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((row, index) => (
                <tr key={index}>
                  <td>
                    <strong>{row.skillName}</strong>
                  </td>
                  <td>{row.candidateCount}</td>
                  <td>
                    {/* Використання кольорового маркування для оцінок */}
                    <span
                      className={
                        row.averageGrade >= 70
                          ? styles.text_success
                          : row.averageGrade < 40
                            ? styles.text_danger
                            : ''
                      }
                    >
                      {row.averageGrade?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  Дані відсутні за обраний період
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SkillComplianceStats;
