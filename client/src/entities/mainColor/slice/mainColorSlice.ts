import { createSlice } from '@reduxjs/toolkit';
import {
  getMainColorsThunk,
  createMainColorThunk,
  deleteMainColorThunk,
} from '../api/mainColorThunkApi';
import type { IMainColor, ArrayMainColorsType } from '@/entities/mainColor/model/types';

type MainColorsState = {
  mainColors: ArrayMainColorsType;
  isLoading: boolean;
  error: string | null;
};

const initialState: MainColorsState = {
  mainColors: [],
  isLoading: false,
  error: null,
};

const mainColorSlice = createSlice({
  name: 'mainColors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение всех записей о цветах art
      .addCase(getMainColorsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMainColorsThunk.fulfilled, (state, action) => {
        state.mainColors = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getMainColorsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Создание записи о цвете
      .addCase(createMainColorThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMainColorThunk.fulfilled, (state, action) => {
        state.mainColors.push(action.payload.data);
        state.isLoading = false;
      })
      .addCase(createMainColorThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Удаление записи о цвете
      .addCase(deleteMainColorThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMainColorThunk.fulfilled, (state, action) => {
        state.mainColors = state.mainColors.filter(
          (mainColor: IMainColor) => mainColor.id !== action.payload.data.id,
        );
        state.isLoading = false;
      })
      .addCase(deleteMainColorThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      });
  },
});

// Экспорт редьюсера
export const mainColorReducer = mainColorSlice.reducer;
