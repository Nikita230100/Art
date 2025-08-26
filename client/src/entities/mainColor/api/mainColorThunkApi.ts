import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IApiResponseSuccess, IApiResponseReject } from '@/shared/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { AxiosError } from 'axios';
import { MAIN_COLOR_THUNKS_TYPES } from '@/shared/enums/mainColorThunkTypes';
import type { IMainColor } from '@/entities/mainColor/model/types';
import { MAIN_COLOR_API_ROUTES } from '@/shared/enums/mainColorApiRoutes';

type ArrayMainColorsType = IMainColor[];

// Получение всех записей о цветах art
export const getMainColorsThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayMainColorsType>,
  number,
  { rejectValue: IApiResponseReject }
>(MAIN_COLOR_THUNKS_TYPES.GET_MAIN_COLORS, async (artId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<ArrayMainColorsType>>(
      MAIN_COLOR_API_ROUTES.MAIN_COLORS + `/${artId}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Создание записи о цвете
export const createMainColorThunk = createAsyncThunk<
  IApiResponseSuccess<IMainColor>,
  IMainColor,
  { rejectValue: IApiResponseReject }
>(MAIN_COLOR_THUNKS_TYPES.CREATE_MAIN_COLOR, async (mainColorData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IApiResponseSuccess<IMainColor>>(
      MAIN_COLOR_API_ROUTES.MAIN_COLORS,
      mainColorData,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Удаление задачи
export const deleteMainColorThunk = createAsyncThunk<
  IApiResponseSuccess<IMainColor>,
  number,
  { rejectValue: IApiResponseReject }
>(MAIN_COLOR_THUNKS_TYPES.DELETE_MAIN_COLOR, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IApiResponseSuccess<IMainColor>>(
      `${MAIN_COLOR_API_ROUTES.MAIN_COLORS}/${id}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
