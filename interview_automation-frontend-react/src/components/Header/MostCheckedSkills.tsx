// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import snapshotApi from '../../api/request';

// const MostCheckedSkills = () => {
//   const [stats, setStats] = useState([]);
//   const [period, setPeriod] = useState(1); // 1 місяць за замовчуванням
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await snapshotApi.get('/skills/most-checked', {
//         params: { months: period }
//       });

//       // БЕЗПЕКА: Деякі API повертають дані прямо в response, деякі в response.data
//       const data = response.data || response;
//       setStats(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Помилка завантаження статистики', error);
//       setStats([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [period]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return (
//     <div className="stats-card">
//       <h4>Топ навичок за частотою перевірок</h4>

//       {/* Група кнопок для вибору періоду, як передбачено в постановці задачі  */}
//       <div className="btn-group mb-3">
//         <button
//           className={period === 1 ? 'btn active' : 'btn'}
//           onClick={() => setPeriod(1)}
//         >
//           Місяць
//         </button>
//         <button
//           className={period === 6 ? 'btn active' : 'btn'}
//           onClick={() => setPeriod(6)}
//         >
//           Півроку
//         </button>
//         <button
//           className={period === 12 ? 'btn active' : 'btn'}
//           onClick={() => setPeriod(12)}
//         >
//           Рік
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="loader">Завантаження...</div>
//       ) : (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Навичка</th>
//               <th>Кількість перевірок</th>
//               <th>Середній бал</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stats.length > 0 ? (
//               stats.map((s, index) => (
//                 <tr key={index}>
//                   {/* skillName, usageCount, averageGrade мають відповідати полям MostCheckedSkillDto */}
//                   <td>{s.skillName}</td>
//                   <td>{s.usageCount}</td>
//                   <td>
//                     {typeof s.averageGrade === 'number'
//                       ? s.averageGrade.toFixed(2)
//                       : '0.00'}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" style={{ textAlign: 'center' }}>
//                   Дані за обраний період відсутні
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default MostCheckedSkills;
import React, { useState, useEffect, useCallback } from 'react';
import snapshotApi from '../../api/request';
import styles from './MostCheckedSkills.module.scss';

const MostCheckedSkills = () => {
  const [stats, setStats] = useState([]);
  const [period, setPeriod] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await snapshotApi.get('/skills/most-checked', {
        params: { months: period }
      });
      const data = response.data || response;
      setStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Помилка завантаження статистики', error);
      setStats([]);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={styles.stats_card}>
      <h4>Топ навичок за частотою перевірок</h4>

      <div className={styles.btn_group}>
        <button
          className={`${styles.btn} ${period === 1 ? styles.active : ''}`}
          onClick={() => setPeriod(1)}
        >
          Місяць
        </button>
        <button
          className={`${styles.btn} ${period === 6 ? styles.active : ''}`}
          onClick={() => setPeriod(6)}
        >
          Півроку
        </button>
        <button
          className={`${styles.btn} ${period === 12 ? styles.active : ''}`}
          onClick={() => setPeriod(12)}
        >
          Рік
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Оновлення даних...</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Навичка</th>
              <th>Кількість перевірок</th>
              <th>Середній бал</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((s, index) => (
                <tr key={index}>
                  <td>{s.skillName}</td>
                  <td>{s.usageCount}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: s.averageGrade > 70 ? '#16a34a' : '#1e293b'
                      }}
                    >
                      {typeof s.averageGrade === 'number'
                        ? s.averageGrade.toFixed(2)
                        : '0.00'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    textAlign: 'center',
                    padding: '30px',
                    color: '#94a3b8'
                  }}
                >
                  Дані за обраний період відсутні
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MostCheckedSkills;
