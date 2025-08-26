import { createSlice } from '@reduxjs/toolkit';
import {
  getColorsThunk,
  createColorThunk,
  deleteColorThunk,
} from '@/entities/color/api/colorThunkApi';
import type { IColor, ArrayColorsType } from '@/entities/color/model/types';

type ColorsState = {
  colors: ArrayColorsType;
  isLoading: boolean;
  error: string | null;
};

const initialState: ColorsState = {
  colors: [],
  isLoading: false,
  error: null,
};

const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение всех записей о цветах art
      .addCase(getColorsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getColorsThunk.fulfilled, (state, action) => {
        state.colors = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getColorsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Создание записи о цвете
      .addCase(createColorThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createColorThunk.fulfilled, (state, action) => {
        state.colors.push(action.payload.data);
        state.isLoading = false;
      })
      .addCase(createColorThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Удаление записи о цвете
      .addCase(deleteColorThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteColorThunk.fulfilled, (state, action) => {
        state.colors = state.colors.filter((color: IColor) => color.id !== action.payload.data.id);
        state.isLoading = false;
      })
      .addCase(deleteColorThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      });
  },
});

// Экспорт редьюсера
export const colorReducer = colorSlice.reducer;
