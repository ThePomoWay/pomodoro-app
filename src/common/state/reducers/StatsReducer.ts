export const initialStatsState = {
  stats: {},
  oldStats: {},
  loaded: false,
};

export const statsReducer = {
  setStats: (state, action) => {
    state.stats = action.payload;
  },
  setAllStats: (state, action) => {
    state.loaded = true;

    //@ts-ignore
    state.oldStats = action.payload.oldStats;
    //@ts-ignore
    state.stats = action.payload.stats;
  },
};
