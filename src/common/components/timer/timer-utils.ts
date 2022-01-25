export const TAB_POMODORO = 'pomodoro';
export const TAB_BREAK = 'break';
export const TAB_LONG_BREAK = 'long_break'


export function getTab (state) {
    if(state.startsWith('pomo_break')) {
        return TAB_BREAK;
    }
    
    if(state.startsWith('pomo_long_break')) {
        return TAB_LONG_BREAK
    }
    return TAB_POMODORO;
}