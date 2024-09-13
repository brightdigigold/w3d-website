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
  purpose: string;
  devotee_isNewUser: boolean;
  otpMsg: string;
  UserType: 'user' | 'corporate' | 'temple' | '';
  corporateBusinessDetails: CorporateBusinessDetails | null;
  authenticationMode: "personalLogin" | "corporateLogin" | "corporateSignUp" | null;
}

const initialState: AuthState = {
  profileFilled: false,
  showProfileForm: false,
  showProfileFormCorporate: true,
  otpModal: false,
  isLoggedIn: false,
  isLoggedInForTempleReceipt: false,
  purpose: 'login',
  devotee_isNewUser: false,
  otpMsg: "",
  UserType: 'user',
  corporateBusinessDetails: null,
  authenticationMode: "personalLogin",
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
      state.purpose = action.payload;
    },
    setOtpMsg: (state, action: PayloadAction<string>) => {
      state.otpMsg = action.payload;
    },
    SetUserType: (state, action: PayloadAction<'' | 'user' | 'corporate' | 'temple'>) => {
      state.UserType = action.payload;
    },
    setAuthenticationMode: (state, action: PayloadAction<"personalLogin" | "corporateLogin" | "corporateSignUp" | null>) => {
      state.authenticationMode = action.payload;
    },
    setCorporateBusinessDetails: (state, action: PayloadAction<CorporateBusinessDetails | null>) => {
      state.corporateBusinessDetails = action.payload;
    },
  },
});

export const { profileFilled, setShowProfileForm, setShowOTPmodal, setIsLoggedIn, setPurpose, setDevoteeIsNewUser, setIsLoggedInForTempleReceipt, setOtpMsg, SetUserType, setShowProfileFormCorporate, setCorporateBusinessDetails, setAuthenticationMode } = authSlice.actions;
export const selectIsloggedIn = ((state: RootState) => state.auth.isLoggedIn);

export default authSlice.reducer;
