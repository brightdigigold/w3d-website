// metalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GoldData, SilverData } from '@/types';
import { RootState } from './store';

// Define the initial states
const initialGoldState: GoldData = {
  c_parity: 0,
  c_saleParity: 0,
  c_salePrice: 0,
  c_totalPrice: 0,
  createdAt: "",
  isRealTime: true,
  mcx: 0,
  parity: 0,
  percentage: 0,
  saleParity: 0,
  salePrice: 0,
  totalPrice: 0,
  up: false,
  updatedAt: "",
  __v: 0,
  _id: ""
};

const initialSilverState: SilverData = {
  c_parity: 0,
  c_saleParity: 0,
  c_salePrice: 0,
  c_totalPrice: 0,
  createdAt: "",
  isRealTime: true,
  mcx: 0,
  parity: 0,
  percentage: 0,
  saleParity: 0,
  salePrice: 0,
  totalPrice: 0,
  up: false,
  updatedAt: "",
  __v: 0,
  _id: ""
};

const goldSlice = createSlice({
  name: 'gold',
  initialState: initialGoldState,
  reducers: {
    setGoldData: (state, action: PayloadAction<GoldData>) => {
      return { ...state, ...action.payload };
    },
  },
});


const silverSlice = createSlice({
  name: 'silver',
  initialState: initialSilverState,
  reducers: {
    setSilverData: (state, action: PayloadAction<SilverData>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setGoldData } = goldSlice.actions;
export const { setSilverData } = silverSlice.actions;

export const goldReducer = goldSlice.reducer;
export const silverReducer = silverSlice.reducer;
export const SelectGoldData = ((state: RootState) => state.gold);
export const SelectSilverData = ((state: RootState) => state.silver);

