import DateFnsUtils from "@date-io/date-fns";
import { ArrowDownward } from "@material-ui/icons";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../../common/API/network/AuthService";
import Navbar from "../../../common/components/navbar/Navbar";
import { SliderDatePicker } from "../../../common/components/slider-date-picker/SliderDatePicker";
import { TabsComponent } from "../../../common/components/tabs-component/TabsComponent";
import {
  selectOldStats,
  selectStats,
  selectUser,
} from "../../../common/state/selectors/statsSelector";
import { getStatsAsync } from "../../../common/state/thunks/StatsThunk";
import { CompletedPomoSvg } from "../../../common/svgs/CompletedPomoSvg";
import { CompletedPomoSvgDark } from "../../../common/svgs/CompletedPomoSvgDark";
import { PauseStats } from "../../../common/svgs/PauseStats";
import { Statistics } from "../../../common/svgs/Stats";
import { Streak } from "../../../common/svgs/streak";
import { TaskSvg } from "../../../common/svgs/TaskSvg";
import { UndisturbedPomoSvg } from "../../../common/svgs/UndisturbedPomoSvg";
import { months, THEME_LIGHT } from "../../../common/utils/constants";
import {
  getNextSunday,
  getPreviousMonday,
  getTodaysDateFormatted,
  getWeekFormattedDate,
} from "../../../common/utils/date-utils";
import {
  AnalysisBarCharts,
  AnalysisCharts,
} from "../analysis-charts/AnalysisCharts";
import styles from "./analysis-laptop.module.scss";

import { usePaymentStatus } from "../../../common/hooks/PaymentHook";
import { selectTheme } from "../../../common/state/selectors";
import { UndisturbedPomoSvgDark } from "../../../common/svgs/UndisturbedPomoSvgDark";
import Settings from "../../settings/Settings";

const tabs = [
  {
    title: "Daily",
  },
  {
    title: "Weekly",
  },
  {
    title: "Monthly",
  },
];

export function AnalysisLaptop(props) {
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);

  let [date, setDate] = useState(new Date());
  let [weekDate, setWeekDate] = useState(new Date());
  let [monthDate, setMonthDate] = useState(new Date());

  let stats = useSelector(selectStats);
  let oldStats = useSelector(selectOldStats);
  let user = useSelector(selectUser);

  let theme = useSelector(selectTheme);

  let { isSubscriptionActive } = usePaymentStatus();

  let dispatch = useDispatch();

  let callStatsApi = (ind, d) => {
    let startDate,
      mid,
      endDate = new Date(d).setHours(23, 59, 59, 999);
    if (ind === 0) {
      d = new Date(d);
      startDate = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - 1
      ).setHours(0, 0, 0, 0);
      endDate = new Date(d).setHours(23, 59, 59, 999);

      mid = new Date(d).setHours(0, 0, 0, 0);
    }
    if (ind === 1) {
      startDate = getPreviousMonday(
        new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7)
      );
      mid = getPreviousMonday(
        new Date(d.getFullYear(), d.getMonth(), d.getDate())
      );
    }
    if (ind === 2) {
      startDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      mid = new Date(d.getFullYear(), d.getMonth(), 1);
    }

    dispatch(
      getStatsAsync({
        from: startDate,
        to: endDate,
        mid,
      })
    );
  };

  let onTabChange = (ind) => {
    let d = date;
    if (ind === 1) {
      d = weekDate;
    }
    if (ind === 2) {
      d = monthDate;
    }
    setSelectedTabIndex(ind);
    callStatsApi(ind, d);
  };

  let getDiffSvg = (a, b) => {
    if (a < b) {
      return (
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.1688 4.83121C21.5233 4.1857 20.4767 4.1857 19.8312 4.83121L9.31209 15.3503C8.66659 15.9958 8.66659 17.0424 9.31209 17.6879C9.9576 18.3334 11.0042 18.3334 11.6497 17.6879L21 8.33758L30.3503 17.6879C30.9958 18.3334 32.0424 18.3334 32.6879 17.6879C33.3334 17.0424 33.3334 15.9958 32.6879 15.3503L22.1688 4.83121ZM22.6529 36L22.6529 6L19.3471 6L19.3471 36L22.6529 36Z"
            fill="#93B558"
          />
        </svg>
      );
    }
    if (a > b) {
      return <ArrowDownward style={{ color: "#DD726B" }} />;
    }
    return <span></span>;
  };

  let getDiffText = (a, b) => {
    if (a < b) {
      return `${b - a} more than yesterday`;
    }
    if (a > b) {
      return `${a - b} less than yesterday`;
    }
    return `Same as yesterday`;
  };

  let getSliderText = () => {
    let today = getTodaysDateFormatted();
    if (selectedTabIndex === 1) {
      if (today === getTodaysDateFormatted(new Date(weekDate))) {
        return getWeekFormattedDate(new Date(getPreviousMonday())) + " - Today";
      } else {
        return `${getWeekFormattedDate(
          getPreviousMonday(new Date(weekDate))
        )} - ${getWeekFormattedDate(new Date(weekDate))}`;
      }
    }

    return `${
      months[new Date(monthDate).getMonth()]
    }, ${monthDate.getFullYear()}`;
  };

  let onSlide = (action, step) => {
    let date;
    if (action === "increment") {
      if (step === 0) {
        date = new Date();
        (selectedTabIndex === 1 && setWeekDate(date)) || setMonthDate(date);
      } else if (selectedTabIndex === 1) {
        let w = new Date(weekDate);

        date = new Date(w.getFullYear(), w.getMonth(), w.getDay() + 7);

        setWeekDate(date);
      } else {
        let m = new Date(monthDate);
        date = new Date(m.getFullYear(), m.getMonth() + 2, -1);
        setMonthDate(date);
      }
    } else {
      if (selectedTabIndex === 1) {
        let w = new Date(weekDate);
        date = getNextSunday(
          new Date(w.getFullYear(), w.getMonth(), w.getUTCDate() - 7)
        );
        setWeekDate(date);
      } else {
        let m = new Date(monthDate);
        date = new Date(m.getFullYear(), m.getMonth(), -1);
        setMonthDate(date);
      }
    }
    callStatsApi(selectedTabIndex, date);
  };

  let getDatePickerHtml = () => {
    if (selectedTabIndex === 0) {
      return (
        <div className={styles["date-picker"]}>
          <DatePicker
            label="Date"
            value={date}
            variant="outlined"
            onChange={(newValue) => {
              setDate(newValue);
              callStatsApi(selectedTabIndex, newValue);
            }}
          />
        </div>
      );
    }

    return (
      <div className={styles["date-picker"]}>
        <SliderDatePicker max={0} title={getSliderText()} onChange={onSlide} />
      </div>
    );
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={styles["container"]}>
        {AuthService.isLoggedIn() && <Settings />}
        <Navbar selected="2" />
        <div className={styles["main-view"]}>
          <div className={styles["analysis-container"]}>
            <div>
              <h2 className={`font-heading ${styles["heading"]}`}>
                <Streak />
                <p className={styles["title"]}>My Streaks</p>
                <div className={styles["line"]}></div>
              </h2>
              <p className={styles["description"]}>
                Streaks are calculated daily. Complete at least 2 pomodoros in a
                day to increase your streak
              </p>
              <div className={styles["streak-container"]}>
                <div className={styles["longest-streak"]}>
                  <h3 className={`font-big ${styles["text-red"]}`}>
                    {(user &&
                      user.overallStat &&
                      user.overallStat.ls &&
                      user.overallStat.ls.length) ||
                      0}{" "}
                  </h3>
                  <p
                    className={`font-info flex flex-center ${styles["description"]}`}
                  >
                    My Longest Streak
                  </p>
                </div>
                <div className={styles["current-streak"]}>
                  <h3 className={`font-big ${styles["text-blue"]}`}>
                    {(user &&
                      user.overallStat &&
                      user.overallStat.rs &&
                      user.overallStat.rs.length) ||
                      0}{" "}
                  </h3>
                  <p
                    className={`font-info flex flex-center ${styles["description"]}`}
                  >
                    My Current Streak
                  </p>
                </div>
              </div>
            </div>

            <div className={styles["stats"]}>
              <h2 className={`font-heading ${styles["heading"]}`}>
                <Statistics />
                <p className={styles["title"]}>My Statistics</p>
                <div className={styles["line"]}></div>
              </h2>

              <TabsComponent tabs={tabs} onClick={onTabChange} />
              {getDatePickerHtml()}
            </div>

            <div className={styles["daily-pomodoro"]}>
              <h2 className="font-sub-heading">
                Average {tabs[selectedTabIndex].title} Pomodoros
              </h2>

              <div className={styles["daily-pomodoro-stats"]}>
                <div className={styles["completed-pomodoros"]}>
                  {(theme === THEME_LIGHT && <CompletedPomoSvg />) || (
                    <CompletedPomoSvgDark />
                  )}

                  <div className={styles["completed-pomo-stats"]}>
                    <div className={`font-medium ${styles["num"]}`}>
                      {stats.p} {getDiffSvg(oldStats.p, stats.p)}{" "}
                    </div>
                    <div className={`font-normal ${styles["complete-text"]}`}>
                      Pomodoros Completed
                    </div>
                    <div
                      className={`font-info ${
                        (oldStats.p < stats.p && styles["green"]) ||
                        (oldStats.p > stats.p && styles["red"])
                      }`}
                    >
                      {getDiffText(oldStats.p, stats.p)}
                    </div>
                  </div>
                </div>
                <div className={styles["undisturbed-pomos"]}>
                  {(theme === THEME_LIGHT && <UndisturbedPomoSvg />) || (
                    <UndisturbedPomoSvgDark />
                  )}

                  <div className={styles["undisturbed-pomo-stats"]}>
                    <div className={`font-medium ${styles["num"]}`}>
                      {stats.p - stats.dp}
                    </div>
                    <div className={`font-normal ${styles["complete-text"]}`}>
                      Undisturbed Pomodoros
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles["tasks"]}>
              <h2 className="font-sub-heading">Tasks</h2>

              <div className={styles["task-stats-container"]}>
                <TaskSvg className={styles["svg"]} />
                <div className={styles["task-stats"]}>
                  <div className={styles["task-stats-count"]}>
                    <p className="font-medium">{stats.comp || 0}</p>
                    <p className="font-normal">Completed Tasks</p>
                    {/* <p className={`font-info ${styles["view-completed"]}`}>
                      View all Completed Tasks
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["distractions-container"]}>
              <h2 className="font-sub-heading">Pauses and Distractions</h2>
              <div className={styles["pauses-distractions"]}>
                <div className={styles["pauses"]}>
                  <PauseStats />
                  <div className={styles["pauses-stats"]}>
                    <p className="font-medium">
                      {stats.ps} {getDiffSvg(oldStats.ps, stats.ps)}
                    </p>

                    <p className="font-normal">Pauses</p>
                    <p className="font-info">
                      {getDiffText(oldStats.ps, stats.ps)}
                    </p>
                  </div>
                </div>
                {/* <div className={styles["distractions"]}>
                  <Block />
                  <div className={styles["distraction-stats"]}>
                    <p className="font-big">
                      {stats.ds} {getDiffSvg(oldStats.ds, stats.ds)}
                    </p>

                    <p className="font-normal">Visits to blocked sites</p>
                    <p className="font-info">
                      {getDiffText(oldStats.ds, stats.ds)}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className={styles["focused-time-container"]}>
              <h2 className="font-sub-heading">Most focused time of the day</h2>
              <div className="chart">
                <AnalysisBarCharts chartsData={stats.dailyDistributionData} />
              </div>
            </div>

            {selectedTabIndex > 0 && (
              <div className={styles["focused-time-container"]}>
                <h2 className="font-sub-heading">Pomodoros Completed</h2>
                <div className="chart">
                  <AnalysisCharts chartsData={stats.pomosCompletedGraph} />
                </div>
              </div>
            )}

            {selectedTabIndex > 0 && (
              <div className={styles["focused-time-container"]}>
                <h2 className="font-sub-heading">Tasks Completed</h2>
                <div className="chart">
                  <AnalysisCharts chartsData={stats.completedTasksGraph} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
}
