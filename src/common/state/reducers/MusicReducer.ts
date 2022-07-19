export const initialMusicState = {
  isMusicPlaying: false,
  hasInteracted: false,
};

export let musicReducer = {
  setIsMusicPlaying: (state, action) => {
    state.isMusicPlaying = action.payload;
    state.hasInteracted = true;
  },

  setIsClockMusicPlaying: (state, action) => {
    if (!state.hasInteracted) {
      state.isMusicPlaying = action.payload;
    }
  },
};
