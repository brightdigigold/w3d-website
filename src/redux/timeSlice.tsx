import { DECREMENT_TIMER, RESET_TIMER } from './actionTypes';

interface TimerState {
  time: number;
}

const initialState: TimerState = {
  time: 300 // Timer starts at 5:00 (300 seconds)
};

const timerReducer = (state = initialState, action: any): TimerState => {
  switch (action.type) {
    case DECREMENT_TIMER:
      return {
        ...state,
        time: state.time > 0 ? state.time - 1 : 300 // If time is 0, reset to 300 seconds
      };
    case RESET_TIMER:
      return {
        ...state,
        time: initialState.time
      };
    default:
      return state;
  }
};

export default timerReducer;
