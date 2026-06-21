import { InterviewStatuses } from './IInterview';

export interface INewInterview {
  title:string
  searcherId:number
  status:InterviewStatuses
  plannedDateTime?:Date
}
