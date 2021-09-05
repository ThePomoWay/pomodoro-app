import React from "react";
import "./footer.scss"

export default function Footer() {

    return (
        <footer className="footer">
            <div className="meeting">
                <span className="label">Upcoming meeting</span>
                <span className="box"> 4:00PM <span>Tech Review</span>
                </span>
            </div>
            <div className="completed-pomos">
                <span>Completed Pomodoros </span>
                <span className="round-border"></span>
                <span className="round-border"></span>
                <span className="round-border"></span>
                <span className="round-border"></span>
                <span className="round-border"></span>
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