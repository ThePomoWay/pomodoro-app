import React from "react";
import "./navbar.scss";
import { Menu } from "@material-ui/icons";

export default function Navbar() {
    return (
    <div className="navbar">
        <span className="app">
            <img src="/pomo-icon.png" /> 
            <span className="title">Pomodoro App</span>
        </span>

        <div className="links">
            <span className="link-item selected">Today's Tasks</span>
            <span className="link-item">All Tasks</span>
            <span className="link-item">Your Daily Stats</span>
            <span className="link-item">Settings</span>
            <span className="link-item"><Menu /></span>
        </div>
    </div>)
}