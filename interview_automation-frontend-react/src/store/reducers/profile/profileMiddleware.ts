import { Middleware, UnknownAction } from '@reduxjs/toolkit';

import ActionType from '../interwiew/common';
import { getMyInterviews } from './actions';

const profileMiddleware:Middleware = (store) => (next) => async (action) => {
  const typedAction = action as UnknownAction;

  const result = next(typedAction);

  if (typedAction.type === `${ActionType.CHANGE_INTERVIEW_STATUS}/fulfilled` ||
    typedAction.type === `${ActionType.Add_INTERVIEW}/fulfilled`||
    typedAction.type === `${ActionType.UPDATE_INTERVIEW_BY_ID}/fulfilled`) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.dispatch(getMyInterviews());
  }

  return result;
};
export default profileMiddleware;
