
export const initialUserState = {
    user: {},
    loaded: false,
    isLoggedIn: false
}

export const userReducer = {
    setUser: (state, action) => {
        state.user = action.payload;
        state.loaded = true;
    }
}