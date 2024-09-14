import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from './store';

interface AuthState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  user: {
    id: string;
    username: string;
  } | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  accessToken: null,
  user: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      username,
      password,
    });
    console.log('login response', response.data);
    return response.data;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.user = null;
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
        state.user = action.payload.user;
        sessionStorage.setItem('access_token', action.payload.access_token);
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
