import { createAsyncThunk } from '@reduxjs/toolkit';
import { ART_THUNKS_TYPES } from '@/shared/enums/artThunkTypes';
import type { IApiResponseSuccess, IApiResponseReject } from '@/shared/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { ARTS_API_ROUTES } from '@/shared/enums/artsApiRoutes';
import type { ArrayArtsType, IRawArtData, IArt } from '../model/types';
import type { AxiosError } from 'axios';
import type { ArrayColorsType } from '@/entities/color/model/types';

// Получение всех произведений
export const getArtsThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayArtsType>,
  void,
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.GET_ARTS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<ArrayArtsType>>(
      ARTS_API_ROUTES.ARTS,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Получение по id
export const getArtByIdThunk = createAsyncThunk<
  IApiResponseSuccess<IArt>,
  number,
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.GET_ART_BY_ID, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<IArt>>(
      `${ARTS_API_ROUTES.ARTS}/${id}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Создание
export const createArtThunk = createAsyncThunk<
  IApiResponseSuccess<IArt>,
  { artData: IRawArtData; file?: File },
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.CREATE_ART, async ({ artData, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    Object.entries(artData).forEach(([key, value]) => {
      if (['width', 'height', 'depth', 'price', 'quantity'].includes(key)) {
        if (value === 0 || value === '') {
          throw new Error(`Field ${key} cannot be empty or zero`);
        }
      }
      formData.append(key, value.toString());
    });

    if (file) {
      formData.append('img', file);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const { data } = await axiosInstance.post<IApiResponseSuccess<IArt>>(
      ARTS_API_ROUTES.ARTS,
      formData,
    );
    return data;
  } catch (error) {
    console.error('Error in createArtThunk:', error);
    if (error instanceof Error) {
      return rejectWithValue({
        statusCode: 400,
        message: error.message,
        data: null,
        error: 'An error occurred while creating art',
      });
    }
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(
      err.response?.data || {
        statusCode: 400,
        message: 'An error occurred while creating art',
        data: null,
        error: 'An error occurred while creating art',
      },
    );
  }
});

// Обновление
export const updateArtThunk = createAsyncThunk<
  IApiResponseSuccess<IArt>,
  { artData: IArt; file?: File },
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.UPDATE_ART, async ({ artData, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    // Добавляем все поля из artData
    Object.entries(artData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (file) {
      formData.append('img', file);
    }

    const { data } = await axiosInstance.put<IApiResponseSuccess<IArt>>(
      `${ARTS_API_ROUTES.ARTS}/${artData.id}`,
      formData,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(
      err.response?.data || {
        statusCode: 500,
        message: 'Failed to update art',
        data: null,
        error: 'Failed to update art',
      },
    );
  }
});

// Удаление произведения
export const deleteArtThunk = createAsyncThunk<
  IApiResponseSuccess<IArt>,
  number,
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.DELETE_ART, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IApiResponseSuccess<IArt>>(
      `${ARTS_API_ROUTES.ARTS}/${id}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Получение всех произведений по id продавца
export const getArtsBySellerIdThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayArtsType>,
  number,
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.GET_ARTS_BY_SELLER_ID, async (sellerId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<ArrayArtsType>>(
      ARTS_API_ROUTES.SELLER_ARTS,
    );
    return data;
  } catch (error) {
    console.error('Error in getArtsBySellerIdThunk:', error);
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(
      err.response?.data || {
        statusCode: 500,
        message: 'Failed to fetch seller arts',
        data: null,
        error: 'Failed to fetch seller arts',
      },
    );
  }
});

// Получение всех цветов
export const getAllColorsThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayColorsType>,
  void,
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.GET_ALL_COLORS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<ArrayColorsType>>(
      `${ARTS_API_ROUTES.COLORS}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Поиск произведений по цветам
export const searchArtsByColorsThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayArtsType>,
  string[],
  { rejectValue: IApiResponseReject }
>(ART_THUNKS_TYPES.GET_ART_BY_COLORS, async (colorHexes, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IApiResponseSuccess<ArrayArtsType>>(
      `${ARTS_API_ROUTES.ARTS}/colors`,
      { colors: colorHexes },
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
