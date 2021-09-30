import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPomoState, selectTimerString } from "../../state/selectors";
import { tick } from "../../state/slices/TimerSlice";
import "./timer.scss";

let timer = 0;

export default function Timer(){

        let timerString = useSelector(selectTimerString);
        let state = useSelector(selectPomoState);
        let dispatch = useDispatch();

        let startTimer = () => {
            if(!timer) {
                timer = setInterval(() => {dispatch(tick())}, 1000)
            }
        }

        return ( 
            <div className="timer grid grid-center">
                <div className="round border-red grid grid-center">
                    <span> {timerString}</span>
                </div>
                <div className="timer-cta grid">
                    <span className="text-underline cursor-pointer">Start without task</span>
                    <button className="btn btn-simple btn-round" onClick={(e) => startTimer()}>Start Timer</button>
                </div>
            </div>
            );
    }
