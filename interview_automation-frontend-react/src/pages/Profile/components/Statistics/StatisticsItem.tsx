import { useState } from 'react';
import sortBy from 'sort-by';

import IStatistics from '../../../../models/profile/IStatistics';
import convertTimeStampToDate from '../../../../utils/convertTimeStampToDate';

function StatisticsItem({
  skillName, grade, date, questions,
}: IStatistics): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState([...questions]);

  return (
    <>
      <tr style={{ border: '1px solid black' }}>
        <td style={{ borderRight: '1px solid black' }}>{skillName}</td>
        <td style={{ borderRight: '1px solid black' }}>{convertTimeStampToDate(date)}</td>
        <td style={{ borderRight: '1px solid black' }}>{Number(grade).toFixed(2)}</td>
        <td>
          <button
            type="button"
            aria-label="show more"
            id="stat-expanded"
            onClick={(): void => setIsExpanded(!isExpanded)}
          >
            { isExpanded ? '-' : '+' }
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td>
            <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid black' }}>
                  <th
                    style={{ borderRight: '1px solid black' }}
                  >
                    Question
                  </th>
                  <th
                    style={{ borderRight: '1px solid black', cursor: 'pointer' }}
                    onClick={(): void => {
                      setData([...data.sort(sortBy('-grade', 'grade'))]);
                    }}
                  >
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr style={{ borderRight: '1px solid black', borderBottom: '1px solid black' }}>
                    <td style={{ borderRight: '1px solid black' }}>{item.question}</td>
                    <td style={{ borderRight: '1px solid black' }}>{item.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}

export default StatisticsItem;
