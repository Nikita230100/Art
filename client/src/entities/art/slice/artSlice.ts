import { createSlice } from '@reduxjs/toolkit';
import {
  getArtsThunk,
  createArtThunk,
  updateArtThunk,
  deleteArtThunk,
  getArtsBySellerIdThunk,
  getArtByIdThunk,
  getAllColorsThunk,
  searchArtsByColorsThunk,
} from '../api/artThunkApi';
import type { IArt } from '../model/types';
import type { IColor } from '@/entities/color/model/types';

type ArtState = {
  arts: IArt[];
  art: IArt | null;
  colors: IColor[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ArtState = {
  arts: [],
  art: null,
  colors: [],
  isLoading: false,
  error: null,
};

const artSlice = createSlice({
  name: 'art',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение всех произведений
      .addCase(getArtsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArtsThunk.fulfilled, (state, action) => {
        state.arts = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getArtsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })
      // Получение произведения по id
      .addCase(getArtByIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArtByIdThunk.fulfilled, (state, action) => {
        state.art = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getArtByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })
      // Создание произведений
      .addCase(createArtThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createArtThunk.fulfilled, (state, action) => {
        state.arts.push(action.payload.data);
        state.isLoading = false;
      })
      .addCase(createArtThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Обновление произведений
      .addCase(updateArtThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateArtThunk.fulfilled, (state, action) => {
        state.arts = state.arts.map((art: IArt) =>
          art.id === action.payload.data.id ? action.payload.data : art,
        );
        state.isLoading = false;
      })
      .addCase(updateArtThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Удаление произведения
      .addCase(deleteArtThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteArtThunk.fulfilled, (state, action) => {
        state.arts = state.arts.filter((art: IArt) => art.id !== action.payload.data.id);
        state.isLoading = false;
      })
      .addCase(deleteArtThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Получение всех произведений по id продавца
      .addCase(getArtsBySellerIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArtsBySellerIdThunk.fulfilled, (state, action) => {
        state.arts = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getArtsBySellerIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Получение всех цветов
      .addCase(getAllColorsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllColorsThunk.fulfilled, (state, action) => {
        state.colors = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getAllColorsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      })

      // Поиск произведений по цветам
      .addCase(searchArtsByColorsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchArtsByColorsThunk.fulfilled, (state, action) => {
        state.arts = action.payload.data;
        state.isLoading = false;
      })
      .addCase(searchArtsByColorsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
      });
  },
});

export const artReducer = artSlice.reducer;
