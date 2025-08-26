import { createSlice } from '@reduxjs/toolkit';
import { getCartThunk, addToCartThunk, deleteCartThunk, clearCartThunk } from '../api/cartThunkApi';
import type { ICart } from '../model/types';

type CartState = {
  cart: ICart | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение одной корзины
      .addCase(getCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Добавление товара в корзину
      .addCase(addToCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload.data;
        state.isLoading = false;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Удаление товара из корзины
      .addCase(deleteCartThunk.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter(
            (item) => item.artId !== action.payload.data.artId,
          );
          state.cart.total = state.cart.items.reduce((sum, item) => sum + item.sum, 0);
          if (state.cart.items.length === 0) {
            state.cart = null;
          }
        }
        state.isLoading = false;
      })
      // Очистка корзины
      .addCase(clearCartThunk.fulfilled, (state, action) => {
        if (action.payload?.statusCode === 200) {
          state.cart = {
            items: [],
            total: 0,
          };
        }
        state.isLoading = false;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      });
  },
});

export const cartReducer = cartSlice.reducer;
