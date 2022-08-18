import { configureStore } from "@reduxjs/toolkit";
import { globalSlice } from "./slice/GlobalSlice";
import { projectSlice } from "./slice/ProjectSlice";
import { statsSlice } from "./slice/StatsSlice";
import { tagsSlice } from "./slice/TagsSlice";
import { tasksSlice } from "./slice/TasksSlice";
import { timerSlice } from "./slice/TimerSlice";
import { userSlice } from "./slice/UserSlice";
import { onboardingSlice } from "./slice/OnboardingSlice";
import { blockerSlice } from "./slice/BlockerSlice";
import { musicSlice } from "./slice/MusicSlice";

export const store = configureStore({
  reducer: {
    timer: timerSlice.reducer,
    tasks: tasksSlice.reducer,
    global: globalSlice.reducer,
    tags: tagsSlice.reducer,
    projects: projectSlice.reducer,
    stats: statsSlice.reducer,
    user: userSlice.reducer,
    onboarding: onboardingSlice.reducer,
    blocker: blockerSlice.reducer,
    music: musicSlice.reducer,
  },
});
