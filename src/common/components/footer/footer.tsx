import { Lock } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCompletedPomos, selectIfExtensionInstalled, selectTodaysTasks } from "../../state/selectors";
import { updateFocusModeState } from "../../state/slices/GlobalSlice";
import "./footer.scss"

export default function Footer() {

    let todaysTasks = useSelector(selectTodaysTasks);
    let cPomos = useSelector(selectCompletedPomos);

    let ePomos = 0;
    for(let task of todaysTasks) {
        ePomos += task.estimatedPomos
    }

    let dispatch = useDispatch();

    let isExtensionInstalled = useSelector(selectIfExtensionInstalled);

    let [focusModeState, setFocusModeState] = useState(isExtensionInstalled);

    useEffect(() => {
        if(focusModeState !== isExtensionInstalled) {
            setFocusModeState(isExtensionInstalled);
        }
    }, [isExtensionInstalled])

    console.log(focusModeState);

    const onFocusModeClick = useCallback(() => {

        dispatch(updateFocusModeState(!focusModeState))
        setFocusModeState(!focusModeState);
    }, []);

    return (
        <footer className="footer">
            <div className="meeting">
                <span className="label">Upcoming meeting</span>
                <span className="box"> 4:00PM <span>Tech Review</span>
                </span>
            </div>
            <div className="completed-pomos">
                <span>Todays Pomodoros </span>
                {[...Array(cPomos)].map((item, index) => (<span key={`completed-pomo-${index}`} className="round-border filled"></span>))}
                {ePomos > cPomos && [...Array(ePomos - cPomos)].map((item, index) => (<span key={`pending-pomo-${index}`} className="round-border"></span>))}
            </div>
            <div className="focus-mode">
                <span>Focus Mode</span>
                {/* {
                    isExtensionInstalled &&
                    (
                        <div className="lock">
                            <Lock />
                        </div>
                    )
                } */}
                <label className="switch">
                    <input type="checkbox" onChange={(e) => onFocusModeClick()} defaultChecked={focusModeState} />
                    <span className="slider round">
                        
                    </span>
                </label>
            </div>
        </footer>
    )
}