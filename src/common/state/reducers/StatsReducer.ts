
export const initialStatsState = {
    stats: {},
    oldStats: {},
    loaded: false
}

export const statsReducer = {
    setStats: (state, action) => {
        state.stats = action.payload;
    }
}