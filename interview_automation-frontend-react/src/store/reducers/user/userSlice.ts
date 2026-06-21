/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '../../../models/user/IUser';
import getUser from './actions';

type User = {
  userData: IUser
};

const initialState: User = {
  userData: {
    id: 0,
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    avatarImgUrl: '',
    description: '',
    roles: [],
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    deleteUser: (state) => {
      state.userData = {
        id: 0,
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        avatarImgUrl: '',
        description: '',
        roles: [],
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(getUser.fulfilled, (state, { payload }: PayloadAction<IUser>) => {
      state.userData = { ...payload };
    });
  },
});

export const { deleteUser } = userSlice.actions;

export default userSlice.reducer;
