export const initialMusicState = {
  isMusicPlaying: false,
  hasInteracted: false,

  hideElements: false,
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

  setHideElements: (state, action) => {
    state.hideElements = action.payload;
  },
};
