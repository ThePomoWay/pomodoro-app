import React, { Component, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AllTaskSidebar } from '../../common/components/all-task-sidebar/AllTaskSidebar';
import CurrentTask from '../../common/components/current-task/currentTask';
import Footer from '../../common/components/footer/footer';
import Navbar from '../../common/components/navbar/navbar';
import { TodaysTaskContainer } from '../../common/components/tasklist/TodaysTaskContainer';
import Timer from '../../common/components/timer/timer';
import { getAllTasks } from '../../common/state/async';
import { selectPomoState } from '../../common/state/selectors';
import { getTodaysTasks } from '../../common/state/slices/TasksSlice';
import { getTimerState } from '../../common/state/slices/TimerSlice';
import { allowOnlyOneTab } from '../../common/utils/common';
import "./home.scss";


export default function Homepage(){
        let dispatch = useDispatch();

        let [showSidebar, setShowSidebar] = useState(false);

        let pomoState = useSelector(selectPomoState);

        let bgColor = 'floralwhite';
        if(pomoState.startsWith('pomo_break')) {
            bgColor = 'lightskyblue'
        }
        else if(pomoState.startsWith('pomo_long_break')) {
            bgColor= 'lavendar'
        }
        let toggleSidebar = useCallback(() => {
            if(this.state.showSidebar) {
                setTimeout(() => this.setState({showSidebarBtn: !this.state.showSidebarBtn}), 500);
            }
            else {
                this.setState({showSidebarBtn: !this.state.showSidebarBtn});
            }
    
            this.setState({showSidebar: !this.state.showSidebar});
        })

        useEffect(() => {
            dispatch(getAllTasks())
            dispatch(getTimerState())
            setTimeout(() => dispatch(getTodaysTasks()), 0)
            
        }, []);
        return (
        <div className="container">
            <Navbar selected="0"></Navbar>
            <div className={`main-content ${showSidebar ? 'show-sidebar' : 'hide-sidebar'} ${bgColor}`}>
                <div className="timer grid grid-center">
                    <Timer></Timer>
                    {/* <CurrentTask></CurrentTask> */}
                </div>
                <div className="taskList">
                    <TodaysTaskContainer></TodaysTaskContainer>
                </div>
                {/* <div className="sidebar-container">
                    <button onClick={this.toggleSidebar.bind(this)} className={`btn btn-simple btn-round ${this.state.showSidebarBtn ? '' : 'hide'}`}>All Tasks</button>
                    <AllTaskSidebar show={this.state.showSidebar} onClose={this.toggleSidebar.bind(this)}></AllTaskSidebar>
                </div> */}
            </div>
            <div className="footer-container">
                <Footer></Footer>
            </div>
        </div>
            );
    }