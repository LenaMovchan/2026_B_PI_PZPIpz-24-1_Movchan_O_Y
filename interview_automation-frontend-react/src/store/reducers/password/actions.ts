
import { createAsyncThunk } from '@reduxjs/toolkit';

import snapshotApi from '../../../api/request';
import ActionType from './common';

const changePassword = createAsyncThunk(
  ActionType.CHANGE_PASSWORD,
  async ({ password, newPassword, repeatNewPassword }
    :{ password:string, newPassword:string, repeatNewPassword:string }) => 
    
  {await snapshotApi.patch('/users/password', { password, newPassword, repeatNewPassword });}
    
);
export default changePassword;
