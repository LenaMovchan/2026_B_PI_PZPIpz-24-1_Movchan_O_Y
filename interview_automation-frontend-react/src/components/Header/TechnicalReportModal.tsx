import React, { useState } from 'react';

import styles from './TechnicalReportModal.module.scss';
import downloadTechnicalExcelReport from './ReportEx';

interface Props {
  onClose: () => void;
}

const TechnicalReportModal: React.FC<Props> = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!fromDate || !toDate) {
      alert('Будь ласка, оберіть обидві дати');
      return;
    }
    setLoading(true);
    try {
      await downloadTechnicalExcelReport(fromDate, toDate);
      onClose(); // Закрити вікно після успішного завантаження
    } catch (e) {
      alert('Помилка при генерації звіту');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <h3>Параметри звіту Excel</h3>
        <p>Оберіть період для аналізу технічного рівня кандидатів</p>

        <div className={styles.input_group}>
          <label>З:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className={styles.input_group}>
          <label>По:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.btn_cancel}>
            Скасувати
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className={styles.btn_confirm}
          >
            {loading ? 'Формування...' : 'Завантажити Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalReportModal;
