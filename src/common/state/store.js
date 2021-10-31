import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../../pages/dashboard/state/counterSlice';
import { globalSlice } from './slices/GlobalSlice';
import { tagsSlice } from './slices/TagsSlice';
import { tasksSlice } from './slices/TasksSlice';
import { timerSlice } from './slices/TimerSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    timer: timerSlice.reducer,
    tasks: tasksSlice.reducer,
    global: globalSlice.reducer,
    tags: tagsSlice.reducer
  },
});
