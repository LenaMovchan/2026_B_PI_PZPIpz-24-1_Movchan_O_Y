import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IInteractedUser from '../../../models/user/IInteractedUser';
import getUserById from './actions';

type User = {
  userData: IInteractedUser
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
    completedInterviews:[],
  },
};
const interactedUsersSlice = createSlice({
  name: 'interactedUsers',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUserById.fulfilled, (state, { payload }:
      PayloadAction<IInteractedUser>) => ({
      ...state,
      userData: {
        ...payload
      }
    })

    );
  },
}
);
export default interactedUsersSlice.reducer;
