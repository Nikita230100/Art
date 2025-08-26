import { createSlice } from '@reduxjs/toolkit';
import {
  getOneCartItemThunk,
  createCartItemThunk,
  updateCartItemThunk,
  deleteCartItemThunk,
  getAllItemsInOneCartThunk,
} from '../api/cartItemThunkApi';
import type { ICartItem } from '../model/types';

type CartItemState = {
  cartItem: ICartItem[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CartItemState = {
  cartItem: [],
  isLoading: false,
  error: null,
};

const cartItemSlice = createSlice({
  name: 'cartItem',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение всех записей из одной корзины
      .addCase(getAllItemsInOneCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllItemsInOneCartThunk.fulfilled, (state, action) => {
        state.cartItem = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getOneCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Создание записи товара в корзине
      .addCase(createCartItemThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCartItemThunk.fulfilled, (state, action) => {
        state.cartItem.push(action.payload.data);
        state.isLoading = false;
      })
      .addCase(createCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Обновление записи товара в корзине

      .addCase(updateCartItemThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.cartItem = state.cartItem.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        );
        state.isLoading = false;
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Удаление записи товара в корзине

      .addCase(deleteCartItemThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItemThunk.fulfilled, (state, action) => {
        state.cartItem = state.cartItem.filter((item) => item.id !== action.payload.data.id);
        state.isLoading = false;
      })
      .addCase(deleteCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      });
  },
});

// Экспорт редьюсера
export const cartItemReducer = cartItemSlice.reducer;
