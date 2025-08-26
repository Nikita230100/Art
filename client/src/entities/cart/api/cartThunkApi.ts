import { createAsyncThunk } from '@reduxjs/toolkit';
import { CART_THUNKS_TYPES } from '@/shared/enums/cartThunkTypes';
import type { IApiResponseSuccess, IApiResponseReject } from '@/shared/types';

import { CART_API_ROUTES } from '@/shared/enums/cartsApiRoutes';
import type { ICart } from '../model/types';
import type { AxiosError } from 'axios';
import { axiosInstanceBuyer } from '@/shared/lib/axiosInstanceBuyer';

// Получение корзины
export const getCartThunk = createAsyncThunk<
  IApiResponseSuccess<ICart>,
  void,
  { rejectValue: IApiResponseReject }
>(CART_THUNKS_TYPES.GET_CART, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.get<IApiResponseSuccess<ICart>>(
      `${CART_API_ROUTES.CART}/art`,
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// добавление товара в корзину
export const addToCartThunk = createAsyncThunk<
  IApiResponseSuccess<ICart>,
  number,
  { rejectValue: IApiResponseReject }
>(CART_THUNKS_TYPES.ADD_TO_CART, async (artId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.post<IApiResponseSuccess<ICart>>(
      `${CART_API_ROUTES.CART}/art/${artId}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Обновление количества товара в корзине

export const updateCartThunk = createAsyncThunk<
  IApiResponseSuccess<ICart>,
  { newQuantity: number; artId: number },
  { rejectValue: IApiResponseReject }
>(CART_THUNKS_TYPES.UPDATE_CART, async ({ newQuantity, artId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.put<IApiResponseSuccess<ICart>>(
      `${CART_API_ROUTES.CART}/art/${artId}`,
      {
        quantity: newQuantity,
      },
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Удаление товара из корзины
export const deleteCartThunk = createAsyncThunk<
  IApiResponseSuccess<ICart>,
  { artId: number },
  { rejectValue: IApiResponseReject }
>(CART_THUNKS_TYPES.DELETE_CART, async ({ artId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.delete<IApiResponseSuccess<ICart>>(
      `${CART_API_ROUTES.CART}/art/${artId}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Очистка корзины
export const clearCartThunk = createAsyncThunk<
  IApiResponseSuccess<ICart>,
  void,
  { rejectValue: IApiResponseReject }
>(CART_THUNKS_TYPES.CLEAR_CART, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.delete<IApiResponseSuccess<ICart>>(
      `${CART_API_ROUTES.CART}/deletecart`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
