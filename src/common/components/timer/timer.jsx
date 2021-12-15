import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDefaultTimes, selectPomoState, selectTimer } from "../../state/selectors";
import { tickAsync, updateNextState, updateTimerState } from "../../state/slices/TimerSlice";
import { POMO_RUNNING_STATE, POMO_IDLE_STATE, POMO_PAUSED_STATE, POMO_BREAK_IDLE_STATE, POMO_LONG_BREAK_IDLE_STATE, POMO_BREAK_RUNNING_STATE, POMO_LONG_BREAK_RUNNING_STATE, POMO_LONG_BREAK_PAUSED_STATE, POMO_BREAK_PAUSED_STATE } from "../../utils/constants";
import styles from "./timer.module.scss";
import { Pause, PlayArrow, SkipNext, Stop } from "@material-ui/icons";
import { getTimerString } from "../../utils/common";

let timer = 0;

const TAB_POMODORO = 'pomodoro';
const TAB_BREAK = 'break';
const TAB_LONG_BREAK = 'long_break'

const ACTION_PLAY = 'play';
const ACTION_PAUSE = 'pause';
const ACTION_SKIP = 'skip';
const ACTION_STOP = 'stop';

const actionStateMap = {
    pomodoro: {
        pause: POMO_PAUSED_STATE,
        play: POMO_RUNNING_STATE,
        stop: POMO_IDLE_STATE
    },
    break: {
        pause: POMO_BREAK_PAUSED_STATE,
        play: POMO_BREAK_RUNNING_STATE,
        stop: POMO_BREAK_IDLE_STATE
    },
    long_break: {
        pause: POMO_LONG_BREAK_PAUSED_STATE,
        play: POMO_LONG_BREAK_RUNNING_STATE,
        stop: POMO_LONG_BREAK_IDLE_STATE
    }
}
let getTab = function(state) {

    if(state.startsWith('pomo_break')) {
        return TAB_BREAK;
    }
    
    if(state.startsWith('pomo_long_break')) {
        return TAB_LONG_BREAK
    }
    return TAB_POMODORO;
}

let getNextPomoState = function(curState, action) {
    return actionStateMap[getTab(curState)] [action];
}
export default function Timer(){

        let timerSec = useSelector(selectTimer);
        let timerString = getTimerString(timerSec);
        let defaults = useSelector(selectDefaultTimes);

        let state = useSelector(selectPomoState);
        let dispatch = useDispatch();

        const doStartTimer = useCallback((isCta) => {
            if(!timer) {
                if(isCta){
                    dispatch(updateTimerState({
                        pomoStartTime: Date.now(),
                        pomoState: getNextPomoState(state, ACTION_PLAY)
                    }));
                }
                else{
                    dispatch(updateTimerState({
                        pomoState: getNextPomoState(state, ACTION_PLAY)
                    }));
                }

                timer = setInterval(() => {
                    if(timerSec <= 0) {
                        dispatch(updateNextState());
                        clearInterval(timer);
                        timer = 0;
                    }
                    else {
                        dispatch(tickAsync())
                    }
                }, 1000)
            }
        });

        const doPauseTimer = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(updateTimerState({
                pomoState: getNextPomoState(state, ACTION_PAUSE),

            }));
        });

        const doStopTimer = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(updateTimerState({
                pomoState: getNextPomoState(state, ACTION_STOP),
                timerInSec: defaults.defaultWorkTime
            }))
        });

        const doSkipBreak = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(updateNextState())
        })
        const getCTA = useCallback((state) => {
            if(state === POMO_IDLE_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid grid-center`}>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={(e) => doStartTimer(true)}>
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
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doStopTimer}> <Stop /> Stop</button>
                    </div>
                );
            }

            if(state === POMO_PAUSED_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={(e) => doStartTimer(false)}> <PlayArrow /> Resume</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doStopTimer}><Stop /> Stop</button>
                    </div>
                );
            }

            if(state === POMO_BREAK_IDLE_STATE || state === POMO_LONG_BREAK_IDLE_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={(e) => doStartTimer(true)}> <PlayArrow /> Start Timer</span>
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
                        <span className="btn btn-simple btn-round flex flex-center" onClick={(e) => doStartTimer(false)}> <PlayArrow /> Start Timer</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doSkipBreak}> <SkipNext /> Skip</button>
                    </div>
                );
            }
        }, [state]);

        useEffect(() => {
            if(timerSec <= 0) {
                clearInterval(timer)
                timer = 0;
                dispatch(updateNextState());
            }

            if(state === POMO_RUNNING_STATE && !timer && timerSec > 0) {
                doStartTimer(false);
            }

            if(state === POMO_PAUSED_STATE && timer) {
                doPauseTimer();
            }
        }, [timerSec, state]);
        
        
        let tab = getTab(state);

        let changePomoState = useCallback((nextState) => {
            let tab = getTab(nextState);
            let nextTimerInSecs = defaults.defaultWorkTime;
            if(tab === TAB_BREAK) {
                nextTimerInSecs = defaults.defaultBreakTime;
            }
            else if(tab === TAB_LONG_BREAK) {
                nextTimerInSecs = defaults.defaultLongBreakTime;
            }
            dispatch(updateTimerState({
                pomoState: nextState,
                timerInSec: nextTimerInSecs
            }))
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
