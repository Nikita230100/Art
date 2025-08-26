import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IApiResponseSuccess, IApiResponseReject } from '@/shared/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { FAVORITES_API_ROUTES } from '@/shared/enums/favoritesApiRoutes';
import type { AxiosError } from 'axios';
import { FAVORITES_THUNKS_TYPES } from '@/shared/enums/favoritesThunkTypes';
import type { IFavorite, IFavoriteAdd } from '@/entities/favorites/model/types';

type ArrayFavoritesType = IFavorite[];

// Получение всех избранных
export const getFavoritesThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayFavoritesType>,
  void,
  { rejectValue: IApiResponseReject }
>(FAVORITES_THUNKS_TYPES.GET_FAVORITES, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<ArrayFavoritesType>>(
      FAVORITES_API_ROUTES.FAVORITES,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Создание избранного
export const createFavoriteThunk = createAsyncThunk<
  IApiResponseSuccess<IFavorite>,
  IFavoriteAdd,
  { rejectValue: IApiResponseReject }
>(FAVORITES_THUNKS_TYPES.CREATE_FAVORITE, async (favoriteData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IApiResponseSuccess<IFavorite>>(
      FAVORITES_API_ROUTES.FAVORITES,
      favoriteData,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Удаление избранного
export const deleteFavoriteThunk = createAsyncThunk<
  IApiResponseSuccess<IFavorite>,
  number,
  { rejectValue: IApiResponseReject }
>(FAVORITES_THUNKS_TYPES.DELETE_FAVORITE, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IApiResponseSuccess<IFavorite>>(
      `${FAVORITES_API_ROUTES.FAVORITES}/${id}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
