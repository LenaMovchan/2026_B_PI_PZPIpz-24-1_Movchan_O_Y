import { createSlice } from '@reduxjs/toolkit';

import deleteAccount from './actions';

interface AccountState {
  error: string | null;
  success: boolean;
}

const initialState: AccountState = {
  error: null,
  success: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearState: (state) => ({
      ...state,
      error: null,
      success: false,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(deleteAccount.fulfilled, (state) => ({
      ...state,
      success: true,
      error: null
    })).addCase(deleteAccount.rejected, (state, action) => {
      const error = action.payload?'ok' : 'ne ok';

      return{
        ...state,
        success: false,
        error
      };
    });
  },
});

export const { clearState } = accountSlice.actions;
export default accountSlice.reducer;

