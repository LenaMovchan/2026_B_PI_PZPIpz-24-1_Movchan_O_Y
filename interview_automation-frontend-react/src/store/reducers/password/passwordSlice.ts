import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import changePassword  from './actions';

interface PasswordState {
  password: string;
  newPassword: string;
  repeatNewPassword: string;
  error: string | null;
  success: boolean;
}

const initialState: PasswordState = {
  password: '',
  newPassword: '',
  repeatNewPassword: '',
  error: null,
  success: false,
};

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    setCurrentPassword: (state, action: PayloadAction<string>) => ({ ...state, password: action.payload }),
    setNewPassword: (state, action: PayloadAction<string>) => ({ ...state, newPassword: action.payload }),
    setConfirmNewPassword: (state, action: PayloadAction<string>) => ({ ...state, repeatNewPassword: action.payload }),
    setError: (state, action: PayloadAction<string | null>) => ({ ...state, error: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.fulfilled, (state) => ({ ...state, success: true, error: null }));
  },
});

export const { setCurrentPassword, setNewPassword, setConfirmNewPassword, setError } = passwordSlice.actions;

export default passwordSlice.reducer;

