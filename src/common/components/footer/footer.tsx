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
        <div className="footer-container">
            <div className="footer">
                {/* <div className="meeting">
                    <span className="label">Upcoming meeting</span>
                    <span className="box"> 4:00PM <span>Tech Review</span>
                    </span>
                </div> */}
                <div className="completed-pomos">
                    <span className="completed-pomos-title">Today's Pomodoros: </span>
                    <div className="completed-pomos-circles">
                    {[...Array(cPomos)].map((item, index) => (<div key={`completed-pomo-${index}`} className="round-border filled">{index+1}</div>))}
                    {/* {ePomos > cPomos && [...Array(ePomos - cPomos)].map((item, index) => (<span key={`pending-pomo-${index}`} className="round-border"></span>))} */}
                    </div>
                </div>
                {/* <div className="focus-mode">
                    <span>Focus Mode</span>
                    <label className="switch">
                        <input type="checkbox" onChange={(e) => onFocusModeClick()} defaultChecked={focusModeState} />
                        <span className="slider round">
                            
                        </span>
                    </label>
                </div> */}
            </div>
        </div>
    )
}