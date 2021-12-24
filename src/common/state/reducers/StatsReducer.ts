
export const initialStatsState = {
    stats: {}
}

export const statsReducer = {
    setStats: (state, action) => {
        state.stats = action.payload;
    }
}