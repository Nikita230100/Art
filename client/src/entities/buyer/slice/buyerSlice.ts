// src/entities/user/slice/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { type BuyerType } from '../model/types';
import {
  refreshTokensThunkBuyer,
  signUpThunkBuyer,
  signInThunkBuyer,
  signOutThunkBuyer,
  updateBuyerThunk,
} from '../api/buyerThunkApi';

// Тип состояния пользователя
type BuyerState = {
  buyer: BuyerType | null;
  error: string | null;
  loading?: boolean;
  isInitializedBuyer?: boolean;
};

// Начальное состояние пользователя
const initialState: BuyerState = {
  buyer: null,
  error: null,
  loading: false,
  isInitializedBuyer: false,
};

// Срез пользователя
const buyerSlice = createSlice({
  name: 'buyer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обновление токенов
      .addCase(refreshTokensThunkBuyer.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokensThunkBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.buyer = action.payload.data.buyer;
        state.error = null;
        state.isInitializedBuyer = true;
      })
      .addCase(refreshTokensThunkBuyer.rejected, (state, action) => {
        state.loading = false;
        state.buyer = null;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitializedBuyer = true;
      })

      // Регистрация
      .addCase(signUpThunkBuyer.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUpThunkBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.buyer = action.payload.data.buyer;
        state.error = null;
        state.isInitializedBuyer = true;
      })
      .addCase(signUpThunkBuyer.rejected, (state, action) => {
        state.loading = false;
        state.buyer = null;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitializedBuyer = true;
      })

      // Авторизация
      .addCase(signInThunkBuyer.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInThunkBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.buyer = action.payload.data.buyer;
        state.error = null;
        state.isInitializedBuyer = true;
      })
      .addCase(signInThunkBuyer.rejected, (state, action) => {
        state.loading = false;
        state.buyer = null;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitializedBuyer = true;
      })

      // Выход
      .addCase(signOutThunkBuyer.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutThunkBuyer.fulfilled, (state) => {
        state.loading = false;
        state.buyer = null;
        state.error = null;
        state.isInitializedBuyer = true;
      })
      .addCase(signOutThunkBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred';
        state.isInitializedBuyer = true;
      })

      // Обновление профиля
      .addCase(updateBuyerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBuyerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.buyer = action.payload.data;
        state.error = null;
      })
      .addCase(updateBuyerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Произошла ошибка при обновлении профиля';
      });
  },
});

// Редьюсер пользователя
export const buyerReducer = buyerSlice.reducer;
