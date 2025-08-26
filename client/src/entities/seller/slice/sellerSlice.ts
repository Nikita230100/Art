// src/entities/user/slice/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { type SellerType } from '../model/types';
import {
  refreshTokensThunk,
  signUpThunk,
  signInThunk,
  signOutThunk,
  updateSellerThunk,
} from '../api/sellerThunkApi';

// Тип состояния пользователя
type SellerState = {
  seller: SellerType | null;
  error: string | null;
  loading?: boolean;
  isInitialized?: boolean;
};

// Начальное состояние пользователя
const initialState: SellerState = {
  seller: null,
  error: null,
  loading: false,
  isInitialized: false,
};

// Срез пользователя
const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обновление токенов
      .addCase(refreshTokensThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokensThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.data.seller;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(refreshTokensThunk.rejected, (state, action) => {
        state.loading = false;
        state.seller = null;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitialized = true;
      })

      // Регистрация
      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.data.seller;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.seller = null;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitialized = true;
      })

      // Авторизация
      .addCase(signInThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.data.seller;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.loading = false;
        state.seller = null;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitialized = true;
      })

      // Выход
      .addCase(signOutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.loading = false;
        state.seller = null;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitialized = true;
      })

      // Обновление данных продавца
      .addCase(updateSellerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSellerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.data;
        console.log(state.seller, 'state.seller');
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(updateSellerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitialized = true;
      });
  },
});

// Редьюсер пользователя
export const sellerReducer = sellerSlice.reducer;
