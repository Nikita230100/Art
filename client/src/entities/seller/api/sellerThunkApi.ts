import { AxiosError } from 'axios';
import type { IApiResponseReject, IApiResponseSuccess } from '@/shared/types';
import type { ISignInData, ISignUpData, SellerType, SellerWithTokenType } from '../model/types';
import { axiosInstance, setAccessToken } from '@/shared/lib/axiosInstance';
import { SELLER_THUNKS_TYPES } from '@/shared/enums/sellerThunkTypes';
import { AUTH_SELLER_API_ROUTES } from '@/shared/enums/sellerApiRoutes';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Обновление токенов
export const refreshTokensThunk = createAsyncThunk<
  IApiResponseSuccess<SellerWithTokenType>,
  void,
  { rejectValue: IApiResponseReject }
>(SELLER_THUNKS_TYPES.REFRESH_TOKENS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IApiResponseSuccess<SellerWithTokenType>>(
      AUTH_SELLER_API_ROUTES.REFRESH_TOKENS,
    );
    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Регистрация
export const signUpThunk = createAsyncThunk<
  IApiResponseSuccess<SellerWithTokenType>,
  ISignUpData,
  { rejectValue: IApiResponseReject }
>(SELLER_THUNKS_TYPES.SIGN_UP, async (sellerData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IApiResponseSuccess<SellerWithTokenType>>(
      AUTH_SELLER_API_ROUTES.SIGN_UP,
      sellerData,
    );
    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Авторизация
export const signInThunk = createAsyncThunk<
  IApiResponseSuccess<SellerWithTokenType>,
  ISignInData,
  { rejectValue: IApiResponseReject }
>(SELLER_THUNKS_TYPES.SIGN_IN, async (sellerData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IApiResponseSuccess<SellerWithTokenType>>(
      AUTH_SELLER_API_ROUTES.SIGN_IN,
      sellerData,
    );
    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Выход
export const signOutThunk = createAsyncThunk<
  IApiResponseSuccess<null>,
  void,
  { rejectValue: IApiResponseReject }
>(SELLER_THUNKS_TYPES.SIGN_OUT, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IApiResponseSuccess<null>>(
      AUTH_SELLER_API_ROUTES.SIGN_OUT,
    );
    setAccessToken('');
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Обновление данных продавца
export const updateSellerThunk = createAsyncThunk<
  IApiResponseSuccess<SellerType>,
  { id: string; sellerData: FormData },
  { rejectValue: IApiResponseReject }
>(SELLER_THUNKS_TYPES.UPDATE_SELLER, async ({ id, sellerData }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put<IApiResponseSuccess<SellerType>>(
      `${AUTH_SELLER_API_ROUTES.UPDATE_SELLER}/${id}`,
      sellerData,
    );
    console.log(data, 'data');
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
