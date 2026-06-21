import snapshotApi from '../../api/request';
const downloadTechnicalExcelReport = async (fromDate, toDate) => {
  try {
    const response = await snapshotApi.get(
      `/interviews/report/technical-level/excel`,
      {
        params: { from: fromDate, to: toDate },
        responseType: 'blob' // Переконайтеся, що це поле саме тут
      }
    );

    // ВАЖЛИВО: Перевірка, чи дані знаходяться в response.data (залежить від налаштувань axios)
    const blobData = response.data || response;

    const blob = new Blob([blobData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Перевірка в консолі: якщо розмір менше 100-200 байт, файл порожній або битий
    console.log('Downloaded blob size:', blob.size);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Technical_Report_${fromDate}_${toDate}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel report', error);
  }
};
export default downloadTechnicalExcelReport;
