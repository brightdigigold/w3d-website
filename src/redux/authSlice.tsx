import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface CorporateBusinessDetails {
  dateOfBirth?: string;
  gstMobile?: string;
  gstNumber?: string;
  legalName?: string;
  pan?: string;
  tradeName?: string;
}


interface AuthState {
  profileFilled: boolean;
  showProfileForm: boolean;
  showProfileFormCorporate: boolean;
  otpModal: boolean;
  isLoggedIn: boolean;
  isLoggedInForTempleReceipt: boolean;
  purpoes: string;
  devotee_isNewUser: boolean;
  otpMsg: string;
  UserType: 'user' | 'corporate' | 'temple' | '';
  corporateBusinessDetails: CorporateBusinessDetails | null;
}

const initialState: AuthState = {
  profileFilled: false,
  showProfileForm: false,
  showProfileFormCorporate: false,
  otpModal: false,
  isLoggedIn: false,
  isLoggedInForTempleReceipt: false,
  purpoes: 'login',
  devotee_isNewUser: false,
  otpMsg: "",
  UserType: 'user',
  corporateBusinessDetails: null,
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
    setShowProfileFormCorporate: (state, action: PayloadAction<boolean>) => {
      state.showProfileFormCorporate = action.payload;
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
    },
    setOtpMsg: (state, action: PayloadAction<string>) => {
      state.otpMsg = action.payload;
    },
    SetUserType: (state, action: PayloadAction<'' | 'user' | 'corporate' | 'temple'>) => {
      state.UserType = action.payload;
    },
    setCorporateBusinessDetails: (state, action: PayloadAction<CorporateBusinessDetails>) => {
      state.corporateBusinessDetails = action.payload;
    },
  },
});

export const { profileFilled, setShowProfileForm, setShowOTPmodal, setIsLoggedIn, setPurpose, setDevoteeIsNewUser, setIsLoggedInForTempleReceipt, setOtpMsg, SetUserType, setShowProfileFormCorporate, setCorporateBusinessDetails } = authSlice.actions;
export const selectIsloggedIn = ((state: RootState) => state.auth.isLoggedIn);

export default authSlice.reducer;
