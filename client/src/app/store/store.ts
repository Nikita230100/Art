import { sellerReducer } from '@/entities/seller';
import { buyerReducer } from '@/entities/buyer';
import { artReducer } from '@/entities/art/slice/artSlice';

import { configureStore } from '@reduxjs/toolkit';
import { favoritesReducer } from '@/entities/favorites/slice/favoritesSlice';
import { mainColorReducer } from '@/entities/mainColor/slice/mainColorSlice';
import { cartItemReducer } from '@/entities/cartItem/slice/cartItemSlice';
import { cartReducer } from '@/entities/cart/slice/cartSlice';
import { colorReducer } from '@/entities/color/slice/colorSlice';

const store = configureStore({
  reducer: {
    seller: sellerReducer,
    buyer: buyerReducer,
    art: artReducer,
    favorites: favoritesReducer,
    cartItem: cartItemReducer,
    cart: cartReducer,
    mainColor: mainColorReducer,
    color: colorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
