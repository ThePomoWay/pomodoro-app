import React from "react";
import "./navbar.scss";
import { Menu } from "@material-ui/icons";
import { Link } from "react-router-dom";

let navItems = [
    {
        title: "Today's Tasks",
        to: '/'
    },
    {
        title: "All Tasks",
        to: '/all'
    },
    {
        title: "Your Daily Stats",
        to: '/analysis'
    },
    {
        title: "Settings",
        to: '/'
    },
];
export default function Navbar(props) {
    return (
    <div className="navbar">
        <span className="app">
            <img src="/pomo-icon.png" alt="Pomodoro icon"/> 
            <span className="title">Pomodoro App</span>
        </span>

        <div className="links">
            {navItems.map((item, index) => (<Link key={index} to={item.to} className={`link-item ${String(index) === props.selected ? 'selected': ''}`}>{item.title}</Link>))}
            <span className="link-item"><Menu /></span>
        </div>
    </div>)
}