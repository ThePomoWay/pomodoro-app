import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../../pages/dashboard/state/counterSlice';
import { timerSlice } from './slices/TimerSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    timer: timerSlice.reducer
  },
});
