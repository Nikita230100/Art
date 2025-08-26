import { AxiosError } from 'axios';
import type { IApiResponseReject, IApiResponseSuccess } from '@/shared/types';
import type { ISignInData, ISignUpData, BuyerWithTokenType, BuyerType } from '../model/types';
import { axiosInstanceBuyer, setAccessTokenBuyer } from '@/shared/lib/axiosInstanceBuyer';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_BUYER_API_ROUTES } from '@/shared/enums/buyerApiRoutes';
import { BUYER_THUNKS_TYPES } from '@/shared/enums/buyerThunkTypes';
// Обновление токенов
export const refreshTokensThunkBuyer = createAsyncThunk<
  IApiResponseSuccess<BuyerWithTokenType>,
  void,
  { rejectValue: IApiResponseReject }
>(BUYER_THUNKS_TYPES.REFRESH_TOKENS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.get<IApiResponseSuccess<BuyerWithTokenType>>(
      AUTH_BUYER_API_ROUTES.REFRESH_TOKENS_BUYER,
    );
    setAccessTokenBuyer(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
// Регистрация
export const signUpThunkBuyer = createAsyncThunk<
  IApiResponseSuccess<BuyerWithTokenType>,
  ISignUpData,
  { rejectValue: IApiResponseReject }
>(BUYER_THUNKS_TYPES.SIGN_UP, async (buyerData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.post<IApiResponseSuccess<BuyerWithTokenType>>(
      AUTH_BUYER_API_ROUTES.SIGN_UP_BUYER,
      buyerData,
    );
    setAccessTokenBuyer(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Авторизация
export const signInThunkBuyer = createAsyncThunk<
  IApiResponseSuccess<BuyerWithTokenType>,
  ISignInData,
  { rejectValue: IApiResponseReject }
>(BUYER_THUNKS_TYPES.SIGN_IN, async (buyerData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.post<IApiResponseSuccess<BuyerWithTokenType>>(
      AUTH_BUYER_API_ROUTES.SIGN_IN_BUYER,
      buyerData,
    );
    setAccessTokenBuyer(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Выход
export const signOutThunkBuyer = createAsyncThunk<
  IApiResponseSuccess<null>,
  void,
  { rejectValue: IApiResponseReject }
>(BUYER_THUNKS_TYPES.SIGN_OUT, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.delete<IApiResponseSuccess<null>>(
      AUTH_BUYER_API_ROUTES.SIGN_OUT_BUYER,
    );
    setAccessTokenBuyer('');
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Обновление профиля покупателя
export const updateBuyerThunk = createAsyncThunk<
  IApiResponseSuccess<BuyerType>,
  FormData,
  { rejectValue: IApiResponseReject }
>(BUYER_THUNKS_TYPES.UPDATE_BUYER, async (buyerData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.put<IApiResponseSuccess<BuyerType>>(
      AUTH_BUYER_API_ROUTES.UPDATE_BUYER,
      buyerData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
