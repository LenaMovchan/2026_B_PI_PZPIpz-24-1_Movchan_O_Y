import { createAsyncThunk } from '@reduxjs/toolkit';

import snapshotApi from '../../../api/request';
import { IUser } from '../../../models/user/IUser';
import ActionType from './common';

const getUser = createAsyncThunk(ActionType.GET_USER, async (): Promise<IUser> => {
  const response: IUser = await snapshotApi.get('users/me');

  return response;
});

export default getUser;
