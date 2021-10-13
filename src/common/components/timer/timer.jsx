import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPomoState, selectTimerString } from "../../state/selectors";
import { initiatePomo, tick } from "../../state/slices/TimerSlice";
import { POMO_RUNNING_STATE, POMO_IDLE_STATE } from "../../utils/constants";
import styles from "./timer.module.scss";
import { Pause, PlayArrow, Stop } from "@material-ui/icons";

let timer = 0;

export default function Timer(){

        let timerString = useSelector(selectTimerString);
        let state = useSelector(selectPomoState);
        let dispatch = useDispatch();

        const startTimer = useCallback(() => {
            if(!timer) {
                dispatch(initiatePomo());
                timer = setInterval(() => {dispatch(tick())}, 1000)
            }
        });

        const getCTA = useCallback((state) => {
            if(state === POMO_IDLE_STATE) {
                return (
                    <div className={`${styles['timer-cta']} grid grid-center`}>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={(e) => startTimer()}>
                            <PlayArrow />
                            Start Timer
                            </button>
                    </div>
                );
            }
        
            if(state === POMO_RUNNING_STATE) {
                return (
                    <div className={`timer-cta grid ${styles['cta-2']}`}>
                        <span className="btn btn-simple btn-round flex flex-center"> <Pause /> Pause</span>
                        <button className="btn btn-simple btn-round flex flex-center" onClick={(e) => startTimer()}><Stop /> Stop</button>
                    </div>
                );
            }
        }, [state])

        if(state === POMO_RUNNING_STATE && !timer) {
            startTimer();
        }
        console.log(styles);
        return ( 
            <div className={`${styles.timer} grid grid-center`}>
                <div className={`${styles.round} ${styles['border-red']} grid grid-center`}>
                    <span> {timerString}</span>
                </div>
                {getCTA(state)}
            </div>
            );
    }
