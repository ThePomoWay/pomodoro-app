import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPomoState, selectTimer, selectTimerString } from "../../state/selectors";
import { initiatePomo, pauseTimer, resetTimer, setPomoState, tick, updateNextState, updateTimerState } from "../../state/slices/TimerSlice";
import { POMO_RUNNING_STATE, POMO_IDLE_STATE, POMO_PAUSED_STATE, POMO_BREAK_IDLE_STATE, POMO_LONG_BREAK_IDLE_STATE, POMO_BREAK_RUNNING_STATE, POMO_LONG_BREAK_RUNNING_STATE, POMO_LONG_BREAK_PAUSED_STATE, POMO_BREAK_PAUSED_STATE } from "../../utils/constants";
import styles from "./timer.module.scss";
import { Pause, PlayArrow, SkipNext, Stop } from "@material-ui/icons";
import { getTimerString } from "../../utils/common";

let timer = 0;

const TAB_POMODORO = 'pomodoro';
const TAB_BREAK = 'break';
const TAB_LONG_BREAK = 'long_break'
let getTab = function(state) {

    let tab = TAB_POMODORO
    if(state.startsWith('pomo_break')) {
        tab = TAB_BREAK;
    }
    else if(state.startsWith('pomo_long_break')) {
        tab = TAB_LONG_BREAK
    }
    return tab;
}

export default function Timer(){


        let timerSec = useSelector(selectTimer);
        let timerString = getTimerString(timerSec);

        let state = useSelector(selectPomoState);
        let dispatch = useDispatch();

        const doStartTimer = useCallback(() => {
            if(!timer) {
                dispatch(updateTimerState({
                    pomoState: POMO_RUNNING_STATE
                }));
                timer = setInterval(() => {dispatch(tick())}, 1000)
            }
        });

        const doPauseTimer = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(updateTimerState({
                pomoState: POMO_PAUSED_STATE
            }));
        });

        const doStopTimer = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(resetTimer());
        });

        const doSkipBreak = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(updateTimerState({
                pomoState: POMO_IDLE_STATE
            }))
        })
        const getCTA = useCallback((state) => {
            if(state === POMO_IDLE_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid grid-center`}>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doStartTimer}>
                            <PlayArrow />
                            Start Timer
                            </button>
                    </div>
                );
            }
        
            if(state === POMO_RUNNING_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={doPauseTimer}> <Pause /> Pause</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doStopTimer}><Stop /> Stop</button>
                    </div>
                );
            }

            if(state === POMO_PAUSED_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={doStartTimer}> <PlayArrow /> Resume</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doStopTimer}><Stop /> Stop</button>
                    </div>
                );
            }

            if(state === POMO_BREAK_IDLE_STATE || state === POMO_LONG_BREAK_IDLE_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={doStartTimer}> <PlayArrow /> Start Timer</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doSkipBreak}><SkipNext /> Skip</button>
                    </div>
                );
            }
            if(state === POMO_BREAK_RUNNING_STATE || state === POMO_LONG_BREAK_RUNNING_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={doPauseTimer}> <Pause /> Pause Timer</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doSkipBreak}><SkipNext /> Skip</button>
                    </div>
                );
            }

            if(state === POMO_LONG_BREAK_PAUSED_STATE || state === POMO_BREAK_PAUSED_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={doStartTimer}> <PlayArrow /> Start Timer</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doSkipBreak}> <SkipNext /> Skip</button>
                    </div>
                );
            }
        }, [state])

        if(state === POMO_RUNNING_STATE && !timer) {
            doStartTimer();
        }

        useEffect(() => {
            if(timerSec <= 0) {
                clearInterval(timer)
                timer = 0;
                dispatch(updateNextState());
            }
        }, [timerSec]);
        
        
        let tab = getTab(state);

        let changePomoState = useCallback((state) => {
            dispatch(setPomoState({state}))
        });

        return ( 
            <div className={`${styles.timer} grid grid-center`}>
                <div className={styles['timer-tabs']}>
                    <div className={`${styles['timer-tabs-item']} ${tab === 'pomodoro' && styles['selected']}`}
                         onClick={() => {changePomoState(POMO_IDLE_STATE)}}>Pomodoro</div>
                    <div className={`${styles['timer-tabs-item']} ${tab === 'break' && styles['selected']}`}
                         onClick={() => {changePomoState(POMO_BREAK_IDLE_STATE)}}>Short break</div>
                    <div className={`${styles['timer-tabs-item']} ${tab === 'long_break' && styles['selected']}`}
                         onClick={() => {changePomoState(POMO_LONG_BREAK_IDLE_STATE)}}>Long break</div>
                </div>
                <div className={`${styles.round} ${styles['border-red']} grid grid-center`}>
                    <span> {timerString}</span>
                </div>
                {getCTA(state)}
            </div>
            );
    }
