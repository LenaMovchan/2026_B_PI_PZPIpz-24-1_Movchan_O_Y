import IQuestion from '../../models/profile/IQuestion';

const formatToLocalDate = (date:string):Date => {
  const localDate = new Date(date);
  const offsetMinutes = localDate.getTimezoneOffset();

  return new Date(localDate.getTime() - (offsetMinutes * 60000));
};
const toLocalDate = (date:string):string => {
  const parts = formatToLocalDate(date).toLocaleString().split(', ');
  const trimmedTime = parts[1].slice(0, -3);

  return `${parts[0]} о ${trimmedTime}`;
};
const formatQuestionsWithLocalDate = (questions:IQuestion[]):IQuestion[] => questions.map((question) => ({
  ...question,
  createdAt: toLocalDate(question.createdAt),
}));
export { formatQuestionsWithLocalDate, formatToLocalDate, toLocalDate };
