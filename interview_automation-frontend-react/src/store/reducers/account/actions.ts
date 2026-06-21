import { createAsyncThunk } from '@reduxjs/toolkit';

import snapshotApi from '../../../api/request';
import ActionType from './common';

const deleteAccount = createAsyncThunk(
  ActionType.DELETE_ACCOUNT,
  async():Promise<string> =>  snapshotApi.delete('/users')
);

export default deleteAccount;
