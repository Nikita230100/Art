import { createSlice } from '@reduxjs/toolkit';
import {
  getFavoritesThunk,
  createFavoriteThunk,
  deleteFavoriteThunk,
} from '../api/favoriteThunkApi';
import type { IFavorite, ArrayFavoritesType } from '@/entities/favorites/model/types';

type FavoritesState = {
  favorites: ArrayFavoritesType;
  isLoading: boolean;
  error: string | null;
};

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение всех избранных
      .addCase(getFavoritesThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavoritesThunk.fulfilled, (state, action) => {
        state.favorites = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getFavoritesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Создание избранного
      .addCase(createFavoriteThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFavoriteThunk.fulfilled, (state, action) => {
        state.favorites.push(action.payload.data);
        state.isLoading = false;
      })
      .addCase(createFavoriteThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Удаление избранного
      .addCase(deleteFavoriteThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFavoriteThunk.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (favorite: IFavorite) => favorite.id !== action.payload.data?.id,
        );
        state.isLoading = false;
      })
      .addCase(deleteFavoriteThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      });
  },
});

// Экспорт редьюсера
export const favoritesReducer = favoritesSlice.reducer;
