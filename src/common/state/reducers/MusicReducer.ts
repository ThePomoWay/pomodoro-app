import { DEFAULT_SOUND } from "../../utils/constants";

export const MUSIC = {
  LOFI: "lofi",
  TICK: "tick",
  NONE: "none",
};

export const initialMusicState = {
  isMusicPlaying: false,
  hasInteracted: false,
  defaultMusic: MUSIC.LOFI,
  hideElements: false,
  volume: 100,
};

export let musicReducer = {
  setIsMusicPlaying: (state, action) => {
    state.isMusicPlaying = action.payload;
  },

  setHasInteracted: (state, action) => {
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

  setDefaultMusic: (state, action) => {
    localStorage.setItem(DEFAULT_SOUND, action.payload);
    state.defaultMusic = action.payload;
  },

  setVolume: (state, action) => {
    state.volume = action.payload;
  },
};
