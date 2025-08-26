import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IApiResponseSuccess, IApiResponseReject } from '@/shared/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { AxiosError } from 'axios';
import { COLOR_THUNKS_TYPES } from '@/shared/enums/colorThunkTypes';
import type { IColor } from '@/entities/color/model/types';
import { COLOR_API_ROUTES } from '@/shared/enums/colorApiRoutes';

type ArrayColorsType = IColor[];

// Получение всех записей возможных цветов
export const getColorsThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayColorsType>,
  void,
  { rejectValue: IApiResponseReject }
>(COLOR_THUNKS_TYPES.GET_COLORS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<ArrayColorsType>>(
      COLOR_API_ROUTES.COLORS,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Создание записи о цвете
export const createColorThunk = createAsyncThunk<
  IApiResponseSuccess<IColor>,
  IColor,
  { rejectValue: IApiResponseReject }
>(COLOR_THUNKS_TYPES.CREATE_COLOR, async (colorData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IApiResponseSuccess<IColor>>(
      COLOR_API_ROUTES.COLORS,
      colorData,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Удаление цвета из справочника
export const deleteColorThunk = createAsyncThunk<
  IApiResponseSuccess<IColor>,
  number,
  { rejectValue: IApiResponseReject }
>(COLOR_THUNKS_TYPES.DELETE_COLOR, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IApiResponseSuccess<IColor>>(
      `${COLOR_API_ROUTES.COLORS}/${id}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
