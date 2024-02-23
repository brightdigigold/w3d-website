// store.ts
import { combineReducers, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { Action, configureStore } from '@reduxjs/toolkit';
import { silverReducer, goldReducer } from './metalSlice';
import shopSlice from './shopSlice';
import couponSlice from './couponSlice';
import timerReducer from './timeSlice';
import giftSlice from './giftSlice';
import userDetailsSlice from './userDetailsSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { UserState } from '@/types';
import authSlice from './authSlice';
import vaultSlice from './vaultSlice';
import cartSlice from './cartSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['shop', 'cart',],
};

const rootReducer = combineReducers({
  vault: vaultSlice,
  gold: goldReducer,
  silver: silverReducer,
  shop: shopSlice,
  coupon: couponSlice,
  time: timerReducer,
  gift: giftSlice,
  user: userDetailsSlice,
  auth: authSlice,
  cart: cartSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<Promise<ReturnType>, RootState, unknown, Action<UserState>>;
export type AppDispatch = typeof store.dispatch;

export default store;

