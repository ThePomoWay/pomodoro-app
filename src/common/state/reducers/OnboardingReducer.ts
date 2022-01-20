export const initialOnboardingState = {
    registerEmail: '',
    step: 1
}

export const onboardingReducer = {
    setRegisterEmail: (state, action) => {
        state.registerEmail = action.payload;
    },
    setStep: (state, action) => {
        state.step = action.payload;
    }
}