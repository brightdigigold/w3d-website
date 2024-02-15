export const DECREMENT_TIMER = 'DECREMENT_TIMER';
export const RESET_TIMER = 'RESET_TIMER';

export const decrementTimer = () => ({
  type: DECREMENT_TIMER
});

export const resetTimer = () => ({
  type: RESET_TIMER
});



export const PROFILE_COMPLETED = 'PROFILE_COMPLETED';
export const SET_SHOW_PROFILE_FORM = 'SET_SHOW_PROFILE_FORM';
export const SET_SHOW_OTP_MODAL = 'SET_SHOW_OTP_MODAL';
export const IS_LOGGED_IN = 'IS_LOGGED_IN';



export interface ProfileFilled {
  type: typeof PROFILE_COMPLETED;
  payload: boolean;
}

export interface SetShowProfileFormAction {
  type: typeof SET_SHOW_PROFILE_FORM;
  payload: boolean;
}

export interface SetOtpModal {
  type: typeof SET_SHOW_OTP_MODAL;
  payload: boolean;
}

export interface IsLoggedIn {
  type: typeof IS_LOGGED_IN;
  payload: boolean;
}
