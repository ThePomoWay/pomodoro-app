import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDefaultTimes, selectFocusMode, selectPomoState, selectTimer } from "../../state/selectors";
import { completePomodoro, pauseTimerAsync, resumeTimerAsync, tickAsync, updateNextState, updateTimerState } from "../../state/slices/TimerSlice";
import { POMO_RUNNING_STATE, POMO_IDLE_STATE, POMO_PAUSED_STATE, POMO_BREAK_IDLE_STATE, POMO_LONG_BREAK_IDLE_STATE, POMO_BREAK_RUNNING_STATE, POMO_LONG_BREAK_RUNNING_STATE, POMO_LONG_BREAK_PAUSED_STATE, POMO_BREAK_PAUSED_STATE } from "../../utils/constants";
import styles from "./timer.module.scss";
import { Pause, PlayArrow, PlayArrowOutlined, Replay, Replay10Outlined, ReplayOutlined, SkipNext, Stop } from "@material-ui/icons";
import { getTimerString } from "../../utils/common";
import { focusModeToggle } from "../../state/slices/GlobalSlice";
import { getTab, TAB_BREAK, TAB_LONG_BREAK, TAB_POMODORO } from "./timer-utils";

let timer = 0;


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

const TIMER_BG_COLOR = {
    [TAB_POMODORO]: "#344493",
    [TAB_BREAK]: "#344493",
    [TAB_LONG_BREAK]: "#344493"
};


let getNextPomoState = function(curState, action) {
    return actionStateMap[getTab(curState)] [action];
}

let getTotalTime = function(defaults, tab) {
    if(tab === TAB_POMODORO) {
        return defaults.defaultWorkTime;
    }
    if(tab === TAB_BREAK) {
        return defaults.defaultBreakTime
    }
    return defaults.defaultLongBreakTime;
}
export default function Timer(){

        let timerSec = useSelector(selectTimer);
        let timerString = getTimerString(timerSec);
        let defaults = useSelector(selectDefaultTimes);

        let focusModeState = useSelector(selectFocusMode);

        let timerSecRef = useRef(null);

        useEffect(() => {
            timerSecRef.current = timerSec;
        })

        let state = useSelector(selectPomoState);
        let dispatch = useDispatch();

        const startInterval = () => {
            if(!timer) {
                timer = setInterval(() => {
                    if(timerSecRef.current > 0) {
                        dispatch(tickAsync());
                        console.log(timerSecRef.current);
                    }
                }, 1000)
            }
        }

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

                startInterval();
            }
        });

        const doPauseTimer = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(pauseTimerAsync());
            // dispatch(updateTimerState({
            //     pomoState: getNextPomoState(state, ACTION_PAUSE),
            // }));
        });

        const doResumeTimer = useCallback(() => {
            
            dispatch(resumeTimerAsync());
            setTimeout(startInterval, 0);
        })

        const doStopTimer = useCallback(() => {
            if(timer) {
                clearInterval(timer);
                timer = 0;
            }
            dispatch(updateTimerState({
                pomoState: getNextPomoState(state, ACTION_STOP),
                timerInSec: defaults.defaultWorkTime,
                ptime:'',
                psec: 0
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
                    <div className={`${styles['timer-cta']} grid grid-center`} onClick={(e) => doStartTimer(true)}>
                        <PlayArrowOutlined />
                    </div>
                );
            }
        
            if(state === POMO_RUNNING_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid ${styles['cta-2']}`}>
                        <span onClick={doPauseTimer}> <Pause /> </span>
                        <span onClick={doStopTimer}> <ReplayOutlined /> </span>
                    </div>
                );
            }

            if(state === POMO_PAUSED_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid ${styles['cta-2']}`}>
                        <span onClick={(e) => doResumeTimer()}> <PlayArrowOutlined /></span>
                        <span onClick={doStopTimer}><ReplayOutlined /></span>
                    </div>
                );
            }

            if(state === POMO_BREAK_IDLE_STATE || state === POMO_LONG_BREAK_IDLE_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid ${styles['cta-2']}`}>
                        <span onClick={(e) => doStartTimer(true)}> <PlayArrow /></span>
                        <span onClick={doSkipBreak}><SkipNext /> </span>
                    </div>
                );
            }
            if(state === POMO_BREAK_RUNNING_STATE || state === POMO_LONG_BREAK_RUNNING_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid ${styles['cta-2']}`}>
                        <span onClick={doPauseTimer}> <Pause /></span>
                        <span onClick={doSkipBreak}><SkipNext /> </span>
                    </div>
                );
            }

            if(state === POMO_LONG_BREAK_PAUSED_STATE || state === POMO_BREAK_PAUSED_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center" onClick={(e) => doStartTimer(false)}> <PlayArrow /> Start Timer</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={doSkipBreak}> <SkipNext /> Skip</button>
                    </div>
                );
            }
        }, [state]);

        useEffect(() => {
            // if(timerSec <= 0) {
            //     clearInterval(timer)
            //     timer = 0;
            //     dispatch(updateNextState());
            // }

            if(state === POMO_RUNNING_STATE && !timer && timerSec > 0) {
                doStartTimer(false);
            }

            if(state === POMO_PAUSED_STATE && timer) {
                doPauseTimer();
            }

            if((state === POMO_BREAK_IDLE_STATE || state === POMO_IDLE_STATE || state === POMO_LONG_BREAK_IDLE_STATE) && timer) {
                clearInterval(timer);
                timer = 0;
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

        let percentComplete = (timerSec / getTotalTime(defaults, tab)) * 100;
        let timerStyle = {
            "background": "linear-gradient(0deg, " + TIMER_BG_COLOR[tab] + " 0%, #5468ce " + percentComplete + "%, white " + (percentComplete+1) + "%, #C3C3C3 100%)"
        }

        const onFocusModeSwitch = useCallback((e) => {
            dispatch(focusModeToggle(!focusModeState));
        })

        return ( 
            <div className={`${styles.timer}`}>
                <div className={styles['timer-tabs']}>
                    <div className={`${styles['timer-tabs-item']} ${tab === 'pomodoro' && styles['selected-purple']}`}
                         onClick={() => {changePomoState(POMO_IDLE_STATE)}}>Work Mode</div>
                    <div className={`${styles['timer-tabs-item']} ${tab === 'break' && styles['selected-pink']}`}
                         onClick={() => {changePomoState(POMO_BREAK_IDLE_STATE)}}>Short Break</div>
                    <div className={`${styles['timer-tabs-item']} ${tab === 'long_break' && styles['selected-cyan']}`}
                         onClick={() => {changePomoState(POMO_LONG_BREAK_IDLE_STATE)}}>Long Break</div>
                </div>
                <div className={`${styles.round} ${styles['border-red']} grid grid-center`} style={timerStyle}>
                    <span className={styles['timer-text']}> {timerString}</span>
                    {getCTA(state)}
                </div>
                
                <div className={styles["focus-mode"]}>
                    <span>Focus Mode</span>
                    <label className="switch">
                        <input type="checkbox" onChange={(e) => {onFocusModeSwitch()}} defaultChecked={focusModeState} />
                        <span className="slider round">
                            
                        </span>
                    </label>
                </div>
            </div>
            );
    }
