import { InterviewStatuses } from '../../models/profile/IInterview';
import IInterviewPreview from '../../models/profile/IInterviewPreview';
import { formatToLocalDate } from '../interview/formatQuestionsWithLocalDate';

const getInterviewsByStatus = (interviews: IInterviewPreview[], status: InterviewStatuses): IInterviewPreview[] =>
  interviews.filter((interview) => interview.status === status);

const getNearestInterviewFromList = (interviews: IInterviewPreview[]): IInterviewPreview =>
  interviews.reduce((nearest, current) => {
    const nearestTime = new Date(nearest.plannedDateTime).getTime();
    const currentTime = new Date(current.plannedDateTime).getTime();

    return currentTime < nearestTime ? current : nearest;
  });

const getNearestInterview = (plannedInterviews: IInterviewPreview[]): IInterviewPreview | undefined => {
  if (plannedInterviews.length === 0) return undefined;

  if (plannedInterviews.length === 1) return { ...plannedInterviews[0] };

  const fifteenMinInMs = 900000;
  const now = new Date().getTime();
  const plannedInterviewsWithoutOverdue = plannedInterviews.filter((interview) => {
    const interviewTime = new Date(formatToLocalDate(interview.plannedDateTime)).getTime();

    return ((now - interviewTime) < fifteenMinInMs);
  });

  return plannedInterviewsWithoutOverdue.length !== 0
    ? getNearestInterviewFromList(plannedInterviewsWithoutOverdue)
    : undefined;
};

const getTimeToInterview = (interviews: IInterviewPreview[]):{ id:number,time:number,title:string } => {
  if (!interviews) return { id:0,time:0,title:'' };

  const plannedInterviews = getInterviewsByStatus(interviews, 'PLANNED');
  const nearestInterview = getNearestInterview(plannedInterviews);
  let nearestInterviewTime: number;

  if (nearestInterview) {
    const actualDate = new Date(formatToLocalDate(nearestInterview.plannedDateTime));
    nearestInterviewTime = actualDate.getTime();
  } else {
    nearestInterviewTime = 0;
  }

  const currentTime = new Date().getTime();

  return {
    time:nearestInterviewTime - currentTime,
    id: nearestInterview?.id||0,
    title:nearestInterview?.title||''
  };
};

export { getInterviewsByStatus, getNearestInterview,getTimeToInterview };
