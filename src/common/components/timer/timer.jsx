
import React, {Component} from "react";
import "./timer.scss";
class Timer extends Component {
    state = { countDown: 25 }
    render() { 
        return ( 
            <div className="timer grid grid-center">
                <div className="round border-red grid grid-center">
                    <span> 25:00</span>
                </div>
            </div>
            );
    }
}
 
export default Timer;