import { IUser } from '../user/IUser';
import IQuestion from './IQuestion';

type InterviewStatuses = 'PLANNED' | 'ACTIVE' | 'FINISHED' | 'COMPLETED' | 'CANCELLED' | '';

interface IInterview {
  id:number,
  title :string
  status: InterviewStatuses
  interviewer: IUser
  searcher: IUser
  plannedDateTime:Date | null
  startDateTime:Date | null
  endDateTime:Date | null
  feedback: string
  questions: IQuestion[]
}

export type { IInterview, InterviewStatuses };

