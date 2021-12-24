import { TextField } from "@material-ui/core";
import { ArrowUpward, ContactSupport, FlashOn, FlashOnOutlined, Info, ViewList } from "@material-ui/icons";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { useState } from "react";
import Navbar from "../../../common/components/navbar/Navbar";
import { TabsComponent } from "../../../common/components/tabs-component/TabsComponent";
import styles from "./analysis-laptop.module.scss";

const tabs = [
    {
        title: 'Daily'
    },
    {
        title: 'Weekly'
    },
    {
        title: 'Monthly'
    }
];

export function AnalysisLaptop(props) {
    let [selectedTabIndex, setSelectedTabIndex] = useState(0);

    let [date, setDate] = useState(new Date());

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={styles['container']}>
                <Navbar selected="2" />
                <div className={styles['main-view']}>
                    <div className={styles['analysis-container']}>
                        <div className={styles['streaks']}>
                            <h2 className="font-heading">Streaks</h2>
                            <p className="font-info">How to maintain a streak? <Info /></p>
                            <div className={styles['streak-container']}>
                                <div className={styles['longest-streak']}>
                                    <h3 className="font-big">12 <FlashOn /> </h3>
                                    <p className="font-info flex flex-center">Your longest streak</p>
                                </div>
                                <div className={styles['current-streak']}>
                                    <h3 className="font-big">08 <FlashOnOutlined /> </h3>
                                    <p className="font-info flex flex-center">Your current streak</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles['stats']}>
                            <h2 className="font-heading">Stats</h2>

                            <TabsComponent tabs={tabs} onClick={(ind) => {setSelectedTabIndex(ind)}} />
                            <div className={styles['date-picker']}>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </div>
                        </div>

                        <div className={styles['daily-pomodoro']}>
                            <h2 className="font-heading">Daily Pomodoro <Info /></h2>

                            <div className={styles['daily-pomodoro-stats']}>
                                <div className={styles['completed-pomodoros']}>
                                    <div className={styles['circle']}>
                                    </div>
                                    <div className={styles['completed-pomo-stats']}>
                                        <div className="font-big">8 <ArrowUpward style={{color: '#93B558'}} /> </div>
                                        <div className={`font-info ${styles['green']}`}>2 more than yesterday</div>
                                        <div className="font-normal">Pomodoros Completed</div>
                                    </div>
                                    
                                </div>
                                <div className={styles['undisturbed-pomos']}>
                                    <div className={styles['circle']}>
                                    </div>
                                    <div className={styles['undisturbed-pomo-stats']}>
                                        <div className="font-big">6</div>
                                        <div className="font-normal">Undisturbed Pomodoros</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles['tasks']}>
                            <h2 className="font-big">Tasks <Info /></h2>

                            <div className={styles['task-stats-container']}>
                                <ViewList className={styles['icon']} />
                                <div className={styles['task-stats']}>
                                    <div className={styles['task-stats-count']}>
                                        <p className="font-big">12</p>
                                        <button className="btn btn-round">View all Completed Tasks</button>

                                    </div>
                                    <p className="font-normal">
                                        Completed Tasks
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={styles['distractions-container']}>
                            <h2 className="font-big">Pauses and Distractions</h2>
                            <div className={styles['pauses-distractions']}>
                                <div className={styles['pauses']}>
                                    <ContactSupport />
                                    <div className={styles['pauses-stats']}>
                                        <p className="font-big">05 <ArrowUpward style={{color: '#DD726B'}} /></p>
                                        <p className="font-info">3 more than yesterday</p>
                                        <p className="font-normal">Pauses</p>
                                    </div>
                                    <div className={styles['distraction-stats']}>
                                        <p className="font-big">02 <ArrowUpward style={{color: '#DD726B'}} /></p>
                                        <p className="font-info">Same as yesterday</p>
                                        <p className="font-normal">Visits to blocked sites</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles['focused-time-container']}>
                                <h2 className="font-big">Most Focused Time</h2>
                                <div className="chart">
                                    //chart
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MuiPickersUtilsProvider>
    )
}