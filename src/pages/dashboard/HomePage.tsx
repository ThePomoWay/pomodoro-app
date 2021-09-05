import React, {Component} from 'react';
import Footer from '../../common/components/footer/footer';
import Navbar from '../../common/components/navbar/navbar';
import { TaskList } from '../../common/components/tasklist/tasklist';
import Timer from '../../common/components/timer/timer';
import "./home.scss";

export default function HomePage() {

    return (
    <div className="container">
        <Navbar></Navbar>
        <div className="main-content">
            <Timer></Timer>
            <div className="taskList">
                <TaskList></TaskList>
            </div>

        </div>
        <div>
            <Footer></Footer>
        </div>
    </div>
        );
}