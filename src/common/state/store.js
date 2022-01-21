import { configureStore } from '@reduxjs/toolkit';
import { globalSlice } from './slices/GlobalSlice';
import { projectSlice } from './slices/ProjectSlice';
import { statsSlice } from './slices/StatsSlice';
import { tagsSlice } from './slices/TagsSlice';
import { tasksSlice } from './slices/TasksSlice';
import { timerSlice } from './slices/TimerSlice';
import { userSlice } from './slices/UserSlice';
import {onboardingSlice} from './slices/OnboardingSlice';
import counterSlice from '../../pages/dashboard/state/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    timer: timerSlice.reducer,
    tasks: tasksSlice.reducer,
    global: globalSlice.reducer,
    tags: tagsSlice.reducer,
    projects: projectSlice.reducer,
    stats: statsSlice.reducer,
    user: userSlice.reducer,
    onboarding: onboardingSlice.reducer
  },
});
