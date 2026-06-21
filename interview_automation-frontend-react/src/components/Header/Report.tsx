import snapshotApi from '../../api/request';

const downloadInterviewReport = async (interviewId: number) => {
  try {
    const response = await snapshotApi.get(
      `/interviews/report/interview/${interviewId}/pdf`,
      {
        responseType: 'blob', // КРИТИЧНО ВАЖЛИВО
        headers: {
          'Accept': 'application/pdf'
        }
      }
    );

    // Перевірка: чи прийшов саме Blob
    // Якщо snapshotApi повертає response.data, використовуємо його
    const data = response.data ? response.data : response;

    const blob = new Blob([data], { type: 'application/pdf' });

    // Перевірка розміру в консолі (має бути більше 0)
    console.log('Blob size:', blob.size);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Interview_Report_${interviewId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Очищення
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Помилка завантаження:', error);
  }
};
export default downloadInterviewReport;
