import { useEffect, useState } from 'react';
import sortBy from 'sort-by';

import { useAppSelector } from '../../../../hooks/redux';
import IStatistics from '../../../../models/profile/IStatistics';
import StatisticsItem from './StatisticsItem';

function StatisticsTable(): JSX.Element {
  const statistics = useAppSelector((state) => state.profile.statistics);
  const [data, setData] = useState<IStatistics[]>([]);

  useEffect(() => {
    setData([...statistics]);
  }, [statistics]);

  return (
    <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
      <caption>Statistics</caption>
      <thead style={{ borderBottom: '1px solid black' }}>
        <tr>
          <th
            onClick={(): void => {
              setData([...data.sort(sortBy('skillName', 'skillName'))]);
            }}
            style={{ cursor: 'pointer', borderRight: '1px solid black' }}
          >
            Skill
          </th>
          <th
            style={{ cursor: 'pointer', borderRight: '1px solid black' }}
            onClick={(): void => {
              setData([...data.sort(sortBy('-date', 'date'))]);
            }}
          >
            Date
          </th>
          <th
            style={{ cursor: 'pointer', borderRight: '1px solid black' }}
            onClick={(): void => {
              setData([...data.sort(sortBy('-grade', 'grade'))]);
            }}
          >
            Grade
          </th>
          <th>Show more</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => <StatisticsItem key={`${item.skillName + index}`} {...item} />)}
      </tbody>
    </table>
  );
}

export default StatisticsTable;
