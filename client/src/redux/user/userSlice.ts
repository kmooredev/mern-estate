import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserState {
  currentUser: string | null;
  error: any;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isLoading = true;
    },
    signInSuccess: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
export default userSlice.reducer;
