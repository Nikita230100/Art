import { createAsyncThunk } from '@reduxjs/toolkit';
import { CARTITEM_THUNKS_TYPES } from '@/shared/enums/cartItemThunkTypes';
import type { IApiResponseSuccess, IApiResponseReject } from '@/shared/types';
import { CARTITEM_API_ROUTES } from '@/shared/enums/cartItemsApiRoutes';
import type { ArrayCartItemsType, IRawCartItemData, ICartItem } from '../model/types';
import type { AxiosError } from 'axios';
import { axiosInstanceBuyer } from '@/shared/lib/axiosInstanceBuyer';

// Получение всех товаров в одной корзине
export const getAllItemsInOneCartThunk = createAsyncThunk<
  IApiResponseSuccess<ArrayCartItemsType>,
  number,
  { rejectValue: IApiResponseReject }
>(CARTITEM_THUNKS_TYPES.GET_ALL_ITEMS_IN_ONE_CART, async (cartId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.get<IApiResponseSuccess<ArrayCartItemsType>>(
      `${CARTITEM_API_ROUTES.CARTITEM}/${cartId}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
// Получение конкретного товара в корзине
export const getOneCartItemThunk = createAsyncThunk<
  IApiResponseSuccess<ICartItem>,
  number,
  { rejectValue: IApiResponseReject }
>(CARTITEM_THUNKS_TYPES.GET_ONE_CART_ITEM, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.get<IApiResponseSuccess<ICartItem>>(
      `${CARTITEM_API_ROUTES.CARTITEM}/${id}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// создание записи товара в корзине
export const createCartItemThunk = createAsyncThunk<
  IApiResponseSuccess<ICartItem>,
  IRawCartItemData,
  { rejectValue: IApiResponseReject }
>(CARTITEM_THUNKS_TYPES.CREATE_CART_ITEM, async (cartItemData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.post<IApiResponseSuccess<ICartItem>>(
      CARTITEM_API_ROUTES.CARTITEM,
      cartItemData,
    );
    return data;
  } catch (error) {
    console.error('Error in createCartThunk:', error);
    if (error instanceof Error) {
      return rejectWithValue({
        statusCode: 400,
        message: error.message,
        data: null,
        error: 'An error occurred while creating cartItem',
      });
    }
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(
      err.response?.data || {
        statusCode: 400,
        message: 'An error occurred while creating cartItem',
        data: null,
        error: 'An error occurred while creating cartItem',
      },
    );
  }
});

// Обновление записи товара в корзине
export const updateCartItemThunk = createAsyncThunk<
  IApiResponseSuccess<ICartItem>,
  ICartItem,
  { rejectValue: IApiResponseReject }
>(CARTITEM_THUNKS_TYPES.UPDATE_CART_ITEM, async (cartItemData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.put<IApiResponseSuccess<ICartItem>>(
      `${CARTITEM_API_ROUTES.CARTITEM}/${cartItemData.id}`,
      cartItemData,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});

// Удаление записи товара в корзине
export const deleteCartItemThunk = createAsyncThunk<
  IApiResponseSuccess<ICartItem>,
  number,
  { rejectValue: IApiResponseReject }
>(CARTITEM_THUNKS_TYPES.DELETE_CART_ITEM, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstanceBuyer.delete<IApiResponseSuccess<ICartItem>>(
      `${CARTITEM_API_ROUTES.CARTITEM}/${id}`,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IApiResponseReject>;
    return rejectWithValue(err.response!.data);
  }
});
