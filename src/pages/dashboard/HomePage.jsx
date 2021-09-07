import React, { Component } from 'react';
import { connect } from 'react-redux';
import Footer from '../../common/components/footer/footer';
import Navbar from '../../common/components/navbar/navbar';
import AddNewTaskModal from '../../common/components/new-task-modal/NewTaskModal';
import { TaskList } from '../../common/components/tasklist/tasklist';
import Timer from '../../common/components/timer/timer';
import { getAllTasks } from '../../common/state/async';
import "./home.scss";


class HomePage extends Component {

    componentDidMount() {
        this.props.getAllTasks();
    }
    render(){
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

export default connect((state) => state, mapDispatchToProps)(HomePage);