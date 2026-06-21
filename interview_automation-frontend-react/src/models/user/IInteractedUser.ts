import IInterviewPreview from '../profile/IInterviewPreview';
import { IUser } from './IUser';

interface IInteractedUser extends IUser{
  completedInterviews:IInterviewPreview[]
}
export default IInteractedUser;
