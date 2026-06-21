import { InterviewStatuses } from './IInterview';
import IUserPreview from './IUserPreview';

interface IInterviewPreview {
  id: number,
  title: string,
  status: InterviewStatuses,
  interviewer:IUserPreview,
  searcher:IUserPreview,
  plannedDateTime: string,
  startDateTime: string,
  endDateTime: string
}

export default IInterviewPreview;
