import React from 'react';

function InterviewStatsHardcoded(): JSX.Element {
  const data = [
    {
      interviewerId: 1,
      lastName: 'surname',
      totalInterviews: 65,
      totalQuestions: 3543,
      avgQuestions: 55
    },
    {
      interviewerId: 5,
      lastName: 'surname5',
      totalInterviews: 3,
      totalQuestions: 9,
      avgQuestions: 3
    },
    {
      interviewerId: 2,
      lastName: 'surname2',
      totalInterviews: 0,
      totalQuestions: 0,
      avgQuestions: null
    },
    {
      interviewerId: 3,
      lastName: 'surname3',
      totalInterviews: 0,
      totalQuestions: 0,
      avgQuestions: null
    },
    {
      interviewerId: 4,
      lastName: 'surname4',
      totalInterviews: 0,
      totalQuestions: 0,
      avgQuestions: null
    },
    {
      interviewerId: 6,
      lastName: 'surname6',
      totalInterviews: 0,
      totalQuestions: 0,
      avgQuestions: null
    },
    {
      interviewerId: 7,
      lastName: 'surname7',
      totalInterviews: 0,
      totalQuestions: 0,
      avgQuestions: null
    },
    {
      interviewerId: 8,
      lastName: 'surname8',
      totalInterviews: 0,
      totalQuestions: 0,
      avgQuestions: null
    }
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📊 Статистика участі інтерв’юерів</h2>
      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID інтерв’юера</th>
            <th>LAST_NAME</th>
            <th>Кількість інтерв’ю</th>
            <th>Кількість питань</th>
            <th>Середня кількість питань на інтерв’ю</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.interviewerId}>
              <td>{item.interviewerId}</td>
              <td>{item.lastName}</td>
              <td>{item.totalInterviews}</td>
              <td>{item.totalQuestions}</td>
              <td>{item.avgQuestions ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterviewStatsHardcoded;
