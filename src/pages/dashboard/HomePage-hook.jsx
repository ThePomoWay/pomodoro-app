import React, { Component, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks } from '../../common/state/async';
import { selectPomoState } from '../../common/state/selectors';
import { getAllProjects } from '../../common/state/slices/ProjectSlice';
import { getAllTags } from '../../common/state/slices/TagsSlice';
import { getTodaysTasks } from '../../common/state/slices/TasksSlice';
import { getTimerState } from '../../common/state/slices/TimerSlice';
import "./home.scss";


export default function useHomepage(){
        let dispatch = useDispatch();

        let [showSidebar, setShowSidebar] = useState(false);

        let pomoState = useSelector(selectPomoState);

        let timerBgColor = 'purple';
        if(pomoState.startsWith('pomo_break')) {
            timerBgColor = 'pink'
        }
        else if(pomoState.startsWith('pomo_long_break')) {
            timerBgColor= 'cyan'
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
            dispatch(getTimerState());
            dispatch(getAllProjects());
            dispatch(getAllTags());
            setTimeout(() => dispatch(getTodaysTasks()), 0)
            
        }, []);

        return {
            showSidebar,
            setShowSidebar,
            toggleSidebar,
            timerBgColor
        }
        
    }