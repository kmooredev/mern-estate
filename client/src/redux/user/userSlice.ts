import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  currentUser: {
    username: string;
    email: string;
    password: string;
    avatar: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  } | null;
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
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateUserStart: (state) => {
      state.isLoading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    deleteUserStart: (state) => {
      state.isLoading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    signoutUserStart: (state) => {
      state.isLoading = true;
    },
    signoutUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    signoutUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
