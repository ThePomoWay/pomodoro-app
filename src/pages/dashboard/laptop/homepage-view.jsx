import { SettingsApplicationsOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCompletedPomos } from "../../../common/state/selectors";
import CurrentTask from "../../../common/components/current-task/currentTask";
import Navbar from "../../../common/components/navbar/Navbar";
import { TodaysTaskContainer } from "../../../common/components/tasklist/TodaysTaskContainer";
import Timer from "../../../common/components/timer/timer";
import {
  getTab,
  TAB_POMODORO,
} from "../../../common/components/timer/timer-utils";
import {
  setIsTimerFullScreen,
  setSettingsModal,
  showClockSettingsModal,
} from "../../../common/state/slice/GlobalSlice";
import { markTaskAsCompleteThunk } from "../../../common/state/thunks/TasksThunk";
import { pauseTimerAsync } from "../../../common/state/thunks/TimerThunk";
import { MaximizeIcon } from "../../../common/svgs/MaximizeIcon";
import { ShrinkIcon } from "../../../common/svgs/ShrinkIcon";
import { scrollToEndOfContainer } from "../../../common/utils/common";
import OnBoarding from "../../onboarding/Onboarding";
import Settings from "../../settings/Settings";
import useHomepage from "../HomePage-hook";
import styles from "./homepage-laptop.module.scss";

import { ReactComponent as SettingsIcon } from "../../../common/svgs/SettingsIcon.svg";
import ClockSettingsModal from "../../../common/components/clock-settings-modal/ClockSettingsModal";
import AuthService from "../../../common/API/network/AuthService";

import { useNavigate } from "react-router-dom";
import { MusicPlayer } from "../../../common/components/music-player/MusicPlayer";
import { HideOnFullScreen } from "../../../common/components/hide-on-full-screen/HideOnFullScreen";
import { useHideOnFullScreen } from "../../../common/components/hide-on-full-screen/useHideOnFullScreen";
import { BreathingExercise } from "../../../common/components/breathing-exercise/BreathingExercise";
import { KeyboardShortcutOverlay } from "../../../common/components/keyboard-shortcut-overlay/KeyboardShortcutOverlay";
import { SessionCompleteModal } from "../../../common/components/session-complete/SessionCompleteModal";
import {
  FlowHeatmap,
  recordPomoCompletion,
} from "../../../common/components/flow-heatmap/FlowHeatmap";
import { FocusScoreDashboard } from "../../../common/components/focus-score/FocusScoreDashboard";
import { AmbientSoundMixer } from "../../../common/components/ambient-sound-mixer/AmbientSoundMixer";
import { MotivationalWidget } from "../../../common/components/motivational-widget/MotivationalWidget";
import {
  AchievementSystem,
  AchievementToast,
  checkAndUnlockAchievements,
} from "../../../common/components/achievements/AchievementSystem";
import {
  FocusTimeline,
  recordFocusSession,
} from "../../../common/components/focus-timeline/FocusTimeline";
import timelineStyles from "../../../common/components/focus-timeline/FocusTimeline.module.scss";
import {
  FocusJournal,
  JournalPrompt,
  JournalBadge,
} from "../../../common/components/focus-journal/FocusJournal";
import { SmartSortPanel } from "../../../common/components/smart-sort/SmartSortPanel";
import sortStyles from "../../../common/components/smart-sort/SmartSortPanel.module.scss";
import {
  DistractionCounter,
  DistractionPanel,
  distractionStyles,
} from "../../../common/components/distraction-tally/DistractionTally";
import {
  POMO_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
} from "../../../common/utils/constants";
import kbdStyles from "../../../common/components/keyboard-shortcut-overlay/KeyboardShortcutOverlay.module.scss";
import heatmapStyles from "../../../common/components/flow-heatmap/FlowHeatmap.module.scss";
import scoreStyles from "../../../common/components/focus-score/FocusScoreDashboard.module.scss";
import mixerStyles from "../../../common/components/ambient-sound-mixer/AmbientSoundMixer.module.scss";
import achievementStyles from "../../../common/components/achievements/AchievementSystem.module.scss";

export function HomepageLaptop() {
  let {
    showSidebar,
    timerBgColor,
    isTimerFullScreen,
    toggleFullScreen,
    pomoState,
  } = useHomepage();

  let dispatch = useDispatch();
  let containerRef = useRef();

  const completedPomos = useSelector(selectCompletedPomos);
  const prevCompletedPomosRef = useRef(completedPomos);

  const motivationalCycleRef = useRef(null);

  const [showBreathing, setShowBreathing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [showJournal, setShowJournal] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [journalNewEntry, setJournalNewEntry] = useState(false);
  const [showSmartSort, setShowSmartSort] = useState(false);
  const [showDistraction, setShowDistraction] = useState(false);
  const currentTask = useSelector((state) => state.tasks.tasks[state.tasks.currentTaskRef]);
  const prevPomoStateRef = useRef(pomoState);

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        document.activeElement?.isContentEditable;
      if (isTyping) return;
      if (e.key === "?") setShowShortcuts((v) => !v);
      if (e.key === "h" || e.key === "H") setShowHeatmap((v) => !v);
      if (e.key === "s" || e.key === "S") setShowScore((v) => !v);
      if (e.key === "m" || e.key === "M") setShowMixer((v) => !v);
      if (e.key === "a" || e.key === "A") setShowAchievements((v) => !v);
      if (e.key === "t" || e.key === "T") setShowTimeline((v) => !v);
      if (e.key === "q" || e.key === "Q") motivationalCycleRef.current?.();
      if (e.key === "j" || e.key === "J") setShowJournal((v) => !v);
      if (e.key === "n" || e.key === "N") setShowSmartSort((v) => !v);
      if (e.key === "d" || e.key === "D") setShowDistraction((v) => !v);
      if (e.key === "Escape") { setShowShortcuts(false); setShowHeatmap(false); setShowScore(false); setShowMixer(false); setShowAchievements(false); setShowTimeline(false); setShowJournal(false); setShowJournalPrompt(false); setShowSmartSort(false); setShowDistraction(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const prev = prevPomoStateRef.current;
    const isBreakNow =
      pomoState === POMO_BREAK_RUNNING_STATE ||
      pomoState === POMO_LONG_BREAK_RUNNING_STATE;
    const wasBreakBefore =
      prev === POMO_BREAK_RUNNING_STATE ||
      prev === POMO_LONG_BREAK_RUNNING_STATE;

    if (isBreakNow && !wasBreakBefore) {
      setShowBreathing(true);
    }
    prevPomoStateRef.current = pomoState;
  }, [pomoState]);

  // Fire session-complete modal every 4 pomodoros; record each completion in heatmap.
  useEffect(() => {
    const prev = prevCompletedPomosRef.current;
    if (completedPomos > prev) {
      recordPomoCompletion();
      recordFocusSession();
      const newly = checkAndUnlockAchievements();
      if (newly.length > 0) setPendingAchievements(newly);
      setShowJournalPrompt(true);
    }
    if (
      completedPomos > 0 &&
      completedPomos % 4 === 0 &&
      completedPomos !== prev
    ) {
      setShowSessionComplete(true);
    }
    prevCompletedPomosRef.current = completedPomos;
  }, [completedPomos]);

  let doFullScreen = () => {
    dispatch(setIsTimerFullScreen(true));
  };

  let openSettingsModal = () => {
    dispatch(showClockSettingsModal());
  };

  let onPause = () => {
    dispatch(setIsTimerFullScreen(false));
  };

  let onTaskComplete = (task) => {
    dispatch(markTaskAsCompleteThunk({ task }));
    dispatch(pauseTimerAsync());
    dispatch(setIsTimerFullScreen(!false));
  };

  let scrollContainer = () => {
    if (containerRef.current) {
      scrollToEndOfContainer(containerRef.current, -100);
    }
  };

  let navigate = useNavigate();

  useEffect(() => {
    if (
      AuthService.isLoggedIn() &&
      window.location.pathname &&
      (window.location.pathname === "/" || window.location.pathname === "/app")
    ) {
      navigate("/home" + window.location.search);
    }
  }, []);

  return (
    <div
      className={
        styles["container"] + " " + (isTimerFullScreen && styles[timerBgColor])
      }
    >
      {showBreathing && (
        <BreathingExercise onDismiss={() => setShowBreathing(false)} />
      )}
      <SessionCompleteModal
        open={showSessionComplete}
        onClose={() => setShowSessionComplete(false)}
        completedPomos={completedPomos}
      />
      <KeyboardShortcutOverlay
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <FlowHeatmap
        open={showHeatmap}
        onClose={() => setShowHeatmap(false)}
      />
      <FocusScoreDashboard
        open={showScore}
        onClose={() => setShowScore(false)}
      />
      <AmbientSoundMixer
        open={showMixer}
        onClose={() => setShowMixer(false)}
      />
      <AchievementSystem
        open={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
      <FocusTimeline
        open={showTimeline}
        onClose={() => setShowTimeline(false)}
      />
      <SmartSortPanel
        open={showSmartSort}
        onClose={() => setShowSmartSort(false)}
      />
      <DistractionPanel
        open={showDistraction}
        onClose={() => setShowDistraction(false)}
      />
      <DistractionCounter sessionNum={completedPomos} />
      <button
        className={distractionStyles.panelBadge}
        onClick={() => setShowDistraction((v) => !v)}
        aria-label="Open distraction analytics"
        title="Distraction Analytics (D)"
      >
        ✗
      </button>
      <FocusJournal
        open={showJournal}
        onClose={() => setShowJournal(false)}
      />
      {showJournalPrompt && (
        <JournalPrompt
          sessionNum={completedPomos}
          taskName={currentTask?.title || ''}
          onSave={() => { setShowJournalPrompt(false); setJournalNewEntry(true); }}
          onDismiss={() => setShowJournalPrompt(false)}
        />
      )}
      {pendingAchievements.length > 0 && (
        <AchievementToast
          achievements={pendingAchievements}
          onViewAll={() => { setPendingAchievements([]); setShowAchievements(true); }}
          onDismiss={() => setPendingAchievements([])}
        />
      )}
      <JournalBadge
        onClick={() => { setShowJournal((v) => !v); setJournalNewEntry(false); }}
        hasNewEntry={journalNewEntry}
      />
      <button
        className={timelineStyles.timelineBadge}
        onClick={() => setShowTimeline((v) => !v)}
        aria-label="Show daily focus timeline"
        title="Focus Timeline (T)"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="6"  cy="10" r="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          <circle cx="14" cy="10" r="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          <line x1="6"  y1="6" x2="6"  y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1="10" y1="5" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1="14" y1="6" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        </svg>
      </button>
      <button
        className={sortStyles.sortBadge}
        onClick={() => setShowSmartSort((v) => !v)}
        aria-label="Open Smart Sort"
        title="Smart Sort (N)"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 5h12M4 10h8M4 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M15 12l2 2 2-2M17 14V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        className={`${achievementStyles.achievementBadge} ${pendingAchievements.length > 0 ? achievementStyles.achievementBadgeNotify : ''}`}
        onClick={() => setShowAchievements((v) => !v)}
        aria-label="Show achievement trophy case"
        title="Achievements (A)"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 2L12.09 7.26L17.5 7.64L13.5 11.14L14.82 16.5L10 13.77L5.18 16.5L6.5 11.14L2.5 7.64L7.91 7.26L10 2Z"
            stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        className={kbdStyles.triggerBadge}
        onClick={() => setShowShortcuts((v) => !v)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        ?
      </button>
      <button
        className={scoreStyles.scoreBadge}
        onClick={() => setShowScore((v) => !v)}
        aria-label="Show focus score"
        title="Focus Score (S)"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
          <path d="M10 10 L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 10 L14 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <circle cx="10" cy="10" r="1.25" fill="currentColor"/>
        </svg>
      </button>
      <button
        className={mixerStyles.mixerBadge}
        onClick={() => setShowMixer((v) => !v)}
        aria-label="Open ambient sound mixer"
        title="Ambient Sounds (M)"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 14V6l9-2v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="5" cy="14" r="2" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="14" cy="12" r="2" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      </button>
      <MotivationalWidget cycleRef={motivationalCycleRef} />
      <button
        className={heatmapStyles.heatmapBadge}
        onClick={() => setShowHeatmap((v) => !v)}
        aria-label="Show flow state heatmap"
        title="Flow State Heatmap (H)"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="2"  y="2"  width="4" height="4" rx="1" fill="currentColor" opacity="0.3"/>
          <rect x="8"  y="2"  width="4" height="4" rx="1" fill="currentColor" opacity="0.7"/>
          <rect x="14" y="2"  width="4" height="4" rx="1" fill="currentColor" opacity="0.5"/>
          <rect x="2"  y="8"  width="4" height="4" rx="1" fill="currentColor" opacity="0.9"/>
          <rect x="8"  y="8"  width="4" height="4" rx="1" fill="currentColor" opacity="1.0"/>
          <rect x="14" y="8"  width="4" height="4" rx="1" fill="currentColor" opacity="0.6"/>
          <rect x="2"  y="14" width="4" height="4" rx="1" fill="currentColor" opacity="0.4"/>
          <rect x="8"  y="14" width="4" height="4" rx="1" fill="currentColor" opacity="0.7"/>
          <rect x="14" y="14" width="4" height="4" rx="1" fill="currentColor" opacity="0.3"/>
        </svg>
      </button>
      <OnBoarding />
      <Settings />
      <ClockSettingsModal />
      <Navbar selected="0"></Navbar>
      <div
        className={`${styles["main-content"]} ${
          showSidebar ? styles["show-sidebar"] : styles["hide-sidebar"]
        }`}
      >
        {isTimerFullScreen && (
          <HideOnFullScreen>
            {/* <div className={styles["settings-icon-max"] + " delay"}>
              <SettingsIcon
                fill="rgb(134, 148, 201)"
                onClick={openSettingsModal}
              />
            </div> */}

            <div
              className={styles["shrink-icon"] + " delay"}
              onClick={(e) => toggleFullScreen()}
            >
              <ShrinkIcon /> Minimize
            </div>
          </HideOnFullScreen>
        )}
        <div className={styles["timer-container"] + " " + styles[timerBgColor]}>
          {!isTimerFullScreen && (
            <div className={styles["maximize-icon"]}>
              <MaximizeIcon onClick={doFullScreen} />
            </div>
          )}
          <div className={`${styles["timer"]}`}>
            <Timer
              onTimerStart={doFullScreen}
              onPause={onPause}
              onReset={(e) => dispatch(setIsTimerFullScreen(false))}
            ></Timer>
          </div>
          {isTimerFullScreen && getTab(pomoState) === TAB_POMODORO && (
            <div className={styles["current-task"]}>
              <CurrentTask onComplete={onTaskComplete} />
            </div>
          )}
        </div>
        <div
          ref={containerRef}
          className={`${styles["taskList"]} ${
            isTimerFullScreen && styles["shrink"]
          }`}
        >
          <TodaysTaskContainer
            toggleFullScreen={toggleFullScreen}
            onSave={scrollContainer}
          ></TodaysTaskContainer>
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
