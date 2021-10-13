import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AllTaskSidebar } from '../../common/components/all-task-sidebar/AllTaskSidebar';
import CurrentTask from '../../common/components/current-task/currentTask';
import Footer from '../../common/components/footer/footer';
import Navbar from '../../common/components/navbar/navbar';
import AddNewTaskModal from '../../common/components/new-task-modal/NewTaskModal';
import { TaskList } from '../../common/components/tasklist/tasklist';
import Timer from '../../common/components/timer/timer';
import { getAllTasks } from '../../common/state/async';
import { allowOnlyOneTab } from '../../common/utils/common';
import "./home.scss";


class HomePage extends Component {
    state = {
        showSidebar: false,
        showSidebarBtn: true
    }

    componentDidMount() {
        this.props.getAllTasks();

        //allowOnlyOneTab('/closetabs');
    }

    toggleSidebar() {
        if(this.state.showSidebar) {
            setTimeout(() => this.setState({showSidebarBtn: !this.state.showSidebarBtn}), 500);
        }
        else {
            this.setState({showSidebarBtn: !this.state.showSidebarBtn});
        }

        this.setState({showSidebar: !this.state.showSidebar});
    }

    render(){
        console.log(this.toggleSidebar);
        return (
        <div className="container">
            <Navbar></Navbar>
            <div className={`main-content ${this.state.showSidebar ? 'show-sidebar' : 'hide-sidebar'}`}>
                <div className="timer grid grid-center">
                    <Timer></Timer>
                    <CurrentTask></CurrentTask>
                </div>
                <div className="taskList">
                    <TaskList></TaskList>
                </div>
                <div className="sidebar-container">
                    <button onClick={this.toggleSidebar.bind(this)} className={`btn btn-simple btn-round ${this.state.showSidebarBtn ? '' : 'hide'}`}>All Tasks</button>
                    <AllTaskSidebar show={this.state.showSidebar} onClose={this.toggleSidebar.bind(this)}></AllTaskSidebar>
                </div>
            </div>
            <div className="footer-container">
                <Footer></Footer>
            </div>

            <AddNewTaskModal></AddNewTaskModal>
        </div>
            );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllTasks: () => dispatch(getAllTasks())
    }
}

export default connect((state) => { return {...state, showSidebar: false}}, mapDispatchToProps)(HomePage);