export const initialRewardState = {
  awardsModalState: true,
};

export let awardsReducer = {
  showAwardsModal: (state, action) => {
    state.awardModalState = true;
  },
  hideAwardsModal: (state, action) => {
    state.awardsModalState = false;
  },
};
