export const initialOnboardingState = {
  registerEmail: "",
  passwordResetMail: "",
  step: 1,
  loginName: "",
  loginPasswordError: "",
};

export const onboardingReducer = {
  setRegisterEmail: (state, action) => {
    state.registerEmail = action.payload;
  },
  initiatePasswordChange: (state, action) => {
    state.step = action.payload;
  },
  setPasswordResetMailId: (state, action) => {
    state.passwordResetMail = action.payload;
  },
  setStep: (state, action) => {
    state.step = action.payload;
  },
  setLoginName: (state, action) => {
    state.loginName = action.payload;
  },
  setLoginPasswordError: (state, action) => {
    state.loginPasswordError = action.payload;
  },
};
