import { createAsyncThunk } from '@reduxjs/toolkit';

import snapshotApi from '../../../api/request';
import IInteractedUser from '../../../models/user/IInteractedUser';
import ActionType from './common';

const getUserById = createAsyncThunk(
  ActionType.GET_USER_BY_ID,
  async (id:number):Promise<IInteractedUser>=>snapshotApi.get(`/users/${id}`)
);
export default  getUserById;
