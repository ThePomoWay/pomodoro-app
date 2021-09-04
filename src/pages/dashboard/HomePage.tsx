import React, {Component} from 'react';
import Timer from '../../common/components/timer/timer';
import { Task } from '../../common/models/Task';
import "./home.scss";

export default function HomePage() {
    return (<div className="wrapper">
        <div className="timer">
            <Timer />
        </div>
        <div className="tasks">

        </div>
        </div>);
}