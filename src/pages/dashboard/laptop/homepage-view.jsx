import Footer from "../../../common/components/footer/footer";
import Navbar from "../../../common/components/navbar/Navbar";
import { TodaysTaskContainer } from "../../../common/components/tasklist/TodaysTaskContainer";
import Timer from "../../../common/components/timer/timer";
import OnBoarding from "../../onboarding/Onboarding";
import useHomepage from "../HomePage-hook";

import styles from './homepage-laptop.module.scss';

export function HomepageLaptop() {
    let {showSidebar, timerBgColor} = useHomepage();

    return (
        <div className={styles["container"]}>
            <OnBoarding />
            <Navbar selected="0"></Navbar>
            <div className={`${styles['main-content']} ${showSidebar ? styles['show-sidebar'] : styles['hide-sidebar']}`}>
                <div className={styles['timer-container']+' '+styles[timerBgColor]}>
                    <div className={`${styles["timer"]}`}>
                        <Timer></Timer>
                        {/* <CurrentTask></CurrentTask> */}
                    </div>
                </div>
                <div className={styles["taskList"]}>
                    <TodaysTaskContainer></TodaysTaskContainer>
                </div>
                {/* <div className="sidebar-container">
                    <button onClick={this.toggleSidebar.bind(this)} className={`btn btn-simple btn-round ${this.state.showSidebarBtn ? '' : 'hide'}`}>All Tasks</button>
                    <AllTaskSidebar show={this.state.showSidebar} onClose={this.toggleSidebar.bind(this)}></AllTaskSidebar>
                </div> */}
            </div>
            {/* <div className={styles["footer-container"]}>
                <Footer></Footer>
            </div> */}
        </div>
            );
}