import { ArrowDownward, ArrowUpward, Block, ContactSupport, FlashOn, FlashOnOutlined, Info, ViewList } from "@material-ui/icons";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { useCallback, useState } from "react";
import Navbar from "../../../common/components/navbar/Navbar";
import { TabsComponent } from "../../../common/components/tabs-component/TabsComponent";
import styles from "./analysis-laptop.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectOldStats, selectStats, selectUser } from "../../../common/state/selectors/statsSelector";
import { getPreviousMonday } from "../../../common/utils/date-utils";
import { getStatsAsync } from "../../../common/state/slices/StatsSlice";

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

    let stats = useSelector(selectStats);
    let oldStats = useSelector(selectOldStats);
    let user = useSelector(selectUser);

    let dispatch = useDispatch();

    let callStatsApi = useCallback((ind) => {
        let startDate, endDate = new Date().setHours(11,59,59,999);
        let d;
        if(ind === 0) {
            d = new Date(d);
            startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1).setHours(0,0,0,0);
            endDate = new Date(d).setHours(11,59,59,999);
        }
        if(ind === 1) {
            d = new Date();
            startDate = getPreviousMonday(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
        }
        if(ind === 2) {
            d = new Date();
            startDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
        }

        dispatch(getStatsAsync({
            from: startDate,
            to: endDate
        }));
    }, []);

    let onTabChange = useCallback((ind) => {
        setSelectedTabIndex(ind);
        callStatsApi(ind);
    }, []);

    let getDiffSvg = useCallback((a, b) => {
        if(a < b) {
            return (<ArrowUpward style={{color: '#93B558'}} />);
        }
        if(a > b) {
            return (<ArrowDownward style={{color: '#DD726B'}} />);
        }
        return (<span></span>);
    });

    let getDiffText = useCallback((a, b) => {
        if(a < b) {
            return `${b-a} more than yesterday`;
        }
        if(a > b) {
            return `${a-b} less than yesterday`;
        }
        return `Same as yesterday`;
    });

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
                                    <h3 className="font-big font-align-center">{user.overallStat && user.overallStat.ls && user.overallStat.ls.length || 0} <FlashOn /> </h3>
                                    <p className="font-info flex flex-center font-align-center">Your longest streak</p>
                                </div>
                                <div className={styles['current-streak']}>
                                    <h3 className="font-big font-align-center">{user.overallStat && user.overallStat.rs && user.overallStat.rs.length || 0} <FlashOnOutlined /> </h3>
                                    <p className="font-info flex flex-center font-align-center">Your current streak</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles['stats']}>
                            <h2 className="font-heading">Stats</h2>

                            <TabsComponent tabs={tabs} onClick={onTabChange} />
                            {selectedTabIndex === 0 && (
                                <div className={styles['date-picker']}>
                                    <DatePicker
                                        label="Date"
                                        value={date}
                                        onChange={(newValue) => {
                                            setDate(newValue);
                                        }}
                                    />
                                </div>
                            )}
                            
                        </div>

                        <div className={styles['daily-pomodoro']}>
                            <h2 className="font-heading">Daily Pomodoro <Info /></h2>

                            <div className={styles['daily-pomodoro-stats']}>
                                <div className={styles['completed-pomodoros']}>
                                    <div className={styles['circle']}>
                                    </div>
                                    <div className={styles['completed-pomo-stats']}>
                                        <div className="font-big">{stats.p} {getDiffSvg(oldStats.p, stats.p)} </div>
                                        <div className={`font-info ${(oldStats.p < stats.p) && styles['green'] || ((oldStats.p > stats.p) && styles['red'])}`}>{getDiffText(oldStats.p, stats.p)}</div>
                                        <div className="font-normal">Pomodoros Completed</div>
                                    </div>
                                    
                                </div>
                                <div className={styles['undisturbed-pomos']}>
                                    <div className={styles['circle']}>
                                    </div>
                                    <div className={styles['undisturbed-pomo-stats']}>
                                        <div className="font-big">{stats.p - stats.dp}</div>
                                        <div className="font-normal">Undisturbed Pomodoros</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className={styles['tasks']}>
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
                        </div> */}

                        <div className={styles['distractions-container']}>
                            <h2 className="font-big">Pauses and Distractions</h2>
                            <div className={styles['pauses-distractions']}>
                                <div className={styles['pauses']}>
                                    <ContactSupport style={{width: '80px', height: '80px'}}/>
                                    <div className={styles['pauses-stats']}>
                                        <p className="font-big">{stats.ps} {getDiffSvg(oldStats.ps, stats.ps)}</p>
                                        <p className="font-info">{getDiffText(oldStats.ps, stats.ps)}</p>
                                        <p className="font-normal">Pauses</p>
                                    </div>
                                </div>
                                <div className={styles['distractions']}>
                                        <Block style={{width: '80px', height: '80px'}} />
                                        <div className={styles['distraction-stats']}>
                                            <p className="font-big">{stats.ds} {getDiffSvg(oldStats.ds, stats.ds)}</p>
                                            <p className="font-info">{getDiffText(oldStats.ds, stats.ds)}</p>
                                            <p className="font-normal">Visits to blocked sites</p>
                                        </div>
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
        </MuiPickersUtilsProvider>
    )
}