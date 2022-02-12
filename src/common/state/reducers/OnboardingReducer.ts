export const initialOnboardingState = {
    registerEmail: '',
    passwordResetMail: '',
    step: 1
}

export const onboardingReducer = {
    setRegisterEmail: (state, action) => {
        state.registerEmail = action.payload;
    },
    initiatePasswordChange: (state, action) => {
        state.step = action.payload;
    },
    setPasswordResetMailId: (state, action) => {
        state.passwordResetMail = action.payload
    },
    setStep: (state, action) => {
        state.step = action.payload
    }
}