import IQuestion from './IQuestion';

interface IStatistics {
  skillName: string,
  grade: string,
  date: string,
  questions: Omit<IQuestion, 'id' | 'createdAt' | 'searcherId' | 'skillName'>[]
}

export default IStatistics;
