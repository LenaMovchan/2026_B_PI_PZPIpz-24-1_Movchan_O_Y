import React, { useCallback, useEffect, useState } from 'react';

import arrowDropDown from '../../../../../../assets/arrowDropDown.svg';
import IInterviewPreview from '../../../../../../models/profile/IInterviewPreview';
import InterviewItemRow from '../InterviewItemRow/InterviewItemRow';
import styles from './MyInterviews.module.scss';
import { sort } from 'd3';

type SortDirection = 'ASC' | 'DESC';

function MyInterviews({
  interviews
}: {
  interviews: IInterviewPreview[];
}): React.JSX.Element {
  const [numberOfRows, setNumberOfRows] = useState(4);
  const [interviewsRow, setInterviews] = useState<IInterviewPreview[]>([]);

  // 1. 🆕 Додаємо стан для відстеження напрямку сортування (за замовчуванням DESC - від найновішого)
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

  // 2. 💡 ФУНКЦІЯ ПОРІВНЯННЯ ДАТ
  // Використовуємо тут функцію, оскільки дати можуть бути у різних полях
  // Я припускаю, що Ви сортуєте за endDateTime, а якщо його немає - за plannedDateTime.
  const compareDates = useCallback(
    (a: IInterviewPreview, b: IInterviewPreview) => {
      // Функція-хелпер для отримання дати для порівняння
      const getDate = (item: IInterviewPreview) =>
        new Date(item.endDateTime || item.plannedDateTime).getTime();

      const dateA = getDate(a);
      const dateB = getDate(b);

      // Порівняння
      if (dateA < dateB) return sortDirection === 'ASC' ? -1 : 1;
      if (dateA > dateB) return sortDirection === 'ASC' ? 1 : -1;
      return 0; // Дати рівні
    },
    [sortDirection]
  ); // Залежність від напрямку сортування

  const updateInterviews = useCallback(() => {
    // ⬇️ ВАЖЛИВО: СОРТУЄМО ВЕСЬ МАСИВ, А ПОТІМ ОБРІЗАЄМО!
    const sortedAndFiltered = [...interviews]
      .sort(compareDates) // Справжнє сортування за датою та напрямком
      .slice(0, numberOfRows); // Обрізаємо для пагінації

    // setInterviews([...interviews].reverse().slice(0, numberOfRows));
    setInterviews(sortedAndFiltered);
  }, [interviews, numberOfRows, compareDates]); // Залежність від compareDates (а вона від sortDirection)
  // }, [interviews, numberOfRows]);
  useEffect(() => {
    updateInterviews();
  }, [interviews, numberOfRows, updateInterviews]);

  const renderTableBody = (): React.JSX.Element[] =>
    interviewsRow.map((item) => <InterviewItemRow key={item.id} {...item} />);

  const handleLoadMoreRows = (): void => {
    setNumberOfRows((currentNumber: number) => currentNumber + 4);
  };
  // const handleDateSort = ():void=>{
  //   setInterviews((prevInterviews) => [...prevInterviews].reverse());
  // };

  // 4. 🖱️ ОНОВЛЕНИЙ ОБРОБНИК КЛІКУ
  const handleDateSort = (): void => {
    // Просто змінюємо напрямок сортування.
    // useEffect/updateInterviews автоматично пересортує дані.
    setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  // Додамо візуальний індикатор сортування
  // const sortIndicator = sortDirection === 'ASC' ? ' ▲' : ' ▼';

  return (
    <>
      <table className={styles.interviewTable}>
        <thead className={styles.interviewTableHeader}>
          <tr>
            {/* //{sortIndicator} */}
            <th className={styles.date}>
              Дата
              <button
                aria-label="sort by date"
                type="button"
                onClick={handleDateSort}
              />
            </th>
            <th>Учасник</th>
            <th>Статус</th>
            <th>Назва</th>
            <th>Дія</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>{renderTableBody()}</tbody>
      </table>
      {numberOfRows <= interviews.length && (
        <div className={styles.DropDownButton}>
          <button type="button" onClick={handleLoadMoreRows}>
            завантажити ще
            <img
              src={arrowDropDown}
              width="24px"
              height="24px"
              alt="downward pointing arrow"
              className={styles.DropDownIcon}
            />
          </button>
        </div>
      )}
    </>
  );
}

export default MyInterviews;
