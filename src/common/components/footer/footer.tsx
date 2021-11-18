import React from "react";
import { useSelector } from "react-redux";
import { selectCompletedPomos, selectTodaysTasks } from "../../state/selectors";
import "./footer.scss"

export default function Footer() {

    let todaysTasks = useSelector(selectTodaysTasks);
    let cPomos = useSelector(selectCompletedPomos);

    let ePomos = 0;
    for(let task of todaysTasks) {
        ePomos += task.estimatedPomos
    }

    console.log(ePomos);

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
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </div>
        </footer>
    )
}