let sampleData = [
  {
    url: "https://figma.com",
    timeInSec: 120,
    origin: "https://figma.com",
    hostname: "figma.com",
  },
  {
    url: "https://facebook.com",
    timeInSec: 1200,
    origin: "https://facebook.com",
    hostname: "facebook.com",
  },
  {
    url: "https://youtube.com",
    timeInSec: 3600,
    origin: "https://youtube.com",
    hostname: "youtube.com",
  },
  {
    url: "https://pomolocal.com",
    timeInSec: 5000,
    origin: "https://pomolocal.com",
  },
  {
    url: "https://pomofocus.io",
    timeInSec: 580,
    origin: "https://pomofocus.io",
  },
];

export const initialBlockerState = {
  blockedWebsites: [],
  history: [],
};

export let blockerReducer = {
  setBlockedWebsites: (state, action) => {
    state.blockedWebsites = action.payload;
  },
  setHistory: (state, action) => {
    state.history = action.payload;
  },
};
