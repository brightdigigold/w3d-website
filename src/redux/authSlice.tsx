import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface AuthState {
  profileFilled: boolean;
  showProfileForm: boolean;
  otpModal: boolean;
  isLoggedIn: boolean;
  isLoggedInForTempleReceipt: boolean;
  purpoes: string;
  devotee_isNewUser: boolean;
}

const initialState: AuthState = {
  profileFilled: false,
  showProfileForm: false,
  otpModal: false,
  isLoggedIn: false,
  isLoggedInForTempleReceipt: false,
  purpoes: 'login',
  devotee_isNewUser: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    profileFilled: (state, action: PayloadAction<boolean>) => {
      state.profileFilled = action.payload;
    },
    setShowProfileForm: (state, action: PayloadAction<boolean>) => {
      state.showProfileForm = action.payload;
    },
    setShowOTPmodal: (state, action: PayloadAction<boolean>) => {
      state.otpModal = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setDevoteeIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.devotee_isNewUser = action.payload;
    },
    setIsLoggedInForTempleReceipt: (state, action: PayloadAction<boolean>) => {
      state.isLoggedInForTempleReceipt = action.payload;
    },
    setPurpose: (state, action: PayloadAction<string>) => {
      state.purpoes = action.payload;
    }
  },
});

export const { profileFilled, setShowProfileForm, setShowOTPmodal, setIsLoggedIn, setPurpose, setDevoteeIsNewUser, setIsLoggedInForTempleReceipt } = authSlice.actions;
export const selectIsloggedIn = ((state: RootState) => state.auth.isLoggedIn);

export default authSlice.reducer;
