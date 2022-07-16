export const initialUserState = {
  user: {
    subscription: {
      status: "inactive",
    },
    expiry: "",
  },
  loaded: false,
  isLoggedIn: false,
};

export const userReducer = {
  setUser: (state, action) => {
    state.user = action.payload;
    state.loaded = true;
  },
};
