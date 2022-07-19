import { createSlice } from "@reduxjs/toolkit";
import { initialMusicState, musicReducer } from "../reducers/MusicReducer";

export const musicSlice = createSlice({
  name: "music",
  initialState: initialMusicState,
  reducers: musicReducer,
});

export const { setIsClockMusicPlaying, setIsMusicPlaying } = musicSlice.actions;
