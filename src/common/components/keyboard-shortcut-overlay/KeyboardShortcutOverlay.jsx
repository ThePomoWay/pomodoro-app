// KeyboardShortcutOverlay — press ? to reveal all keyboard shortcuts.
// Shortcuts actually work: Space = play/pause, R = reset, F = fullscreen.
// All colours via CSS variables — no hardcoded white/black.

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import {
  selectPomoState,
  selectIsTimerFullScreen,
} from "../../state/selectors";
import {
  pauseTimerAsync,
  resumeTimerAsync,
  startTimerAsync,
  resetTimerAsync,
} from "../../state/thunks/TimerThunk";
import {
  setIsTimerFullScreen,
} from "../../state/slice/GlobalSlice";
import {
  POMO_RUNNING_STATE,
  POMO_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
  POMO_IDLE_STATE,
  POMO_BREAK_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
} from "../../utils/constants";
import styles from "./KeyboardShortcutOverlay.module.scss";

const RUNNING_STATES = new Set([
  POMO_RUNNING_STATE,
  POMO_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
]);

const IDLE_STATES = new Set([
  POMO_IDLE_STATE,
  POMO_BREAK_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
]);

const SHORTCUT_SECTIONS = [
  {
    heading: "Timer",
    shortcuts: [
      { keys: ["Space"], description: "Start / Pause timer" },
      { keys: ["R"], description: "Reset timer" },
      { keys: ["F"], description: "Toggle fullscreen focus" },
    ],
  },
  {
    heading: "Navigation",
    shortcuts: [
      { keys: ["G", "H"], description: "Go to Home" },
      { keys: ["G", "A"], description: "Go to Analysis" },
      { keys: ["G", "T"], description: "Go to All Tasks" },
    ],
  },
  {
    heading: "General",
    shortcuts: [
      { keys: ["?"], description: "Toggle this shortcut guide" },
      { keys: ["Esc"], description: "Close any open panel" },
    ],
  },
];

export function KeyboardShortcutOverlay({ open, onClose }) {
  const dispatch = useDispatch();
  const pomoState = useSelector(selectPomoState);
  const isFullScreen = useSelector(selectIsTimerFullScreen);

  const handleSpaceShortcut = useCallback(() => {
    if (RUNNING_STATES.has(pomoState)) {
      dispatch(pauseTimerAsync());
    } else if (IDLE_STATES.has(pomoState)) {
      dispatch(startTimerAsync());
    } else {
      dispatch(resumeTimerAsync());
    }
  }, [dispatch, pomoState]);

  const handleResetShortcut = useCallback(() => {
    dispatch(resetTimerAsync());
  }, [dispatch]);

  const handleFullscreenShortcut = useCallback(() => {
    dispatch(setIsTimerFullScreen(!isFullScreen));
  }, [dispatch, isFullScreen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        document.activeElement?.isContentEditable;

      if (isTyping) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          handleSpaceShortcut();
          break;
        case "r":
        case "R":
          handleResetShortcut();
          break;
        case "f":
        case "F":
          handleFullscreenShortcut();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSpaceShortcut, handleResetShortcut, handleFullscreenShortcut]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-label="Keyboard shortcuts guide"
      disableAutoFocus
    >
      <div className={styles.backdrop} onClick={onClose}>
        <div
          className={styles.panel}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div className={styles.header}>
            <h2 className={styles.title}>Keyboard Shortcuts</h2>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close shortcuts panel"
            >
              ✕
            </button>
          </div>

          <div className={styles.grid}>
            {SHORTCUT_SECTIONS.map((section) => (
              <section key={section.heading} className={styles.section}>
                <h3 className={styles.sectionHeading}>{section.heading}</h3>
                <ul className={styles.shortcutList}>
                  {section.shortcuts.map((s) => (
                    <li key={s.description} className={styles.shortcutRow}>
                      <span className={styles.keys}>
                        {s.keys.map((k, i) => (
                          <span key={k} className={styles.keyGroup}>
                            <kbd className={styles.key}>{k}</kbd>
                            {i < s.keys.length - 1 && (
                              <span className={styles.then}>then</span>
                            )}
                          </span>
                        ))}
                      </span>
                      <span className={styles.desc}>{s.description}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className={styles.hint}>
            Press <kbd className={styles.key}>?</kbd> anywhere to toggle this guide
          </p>
        </div>
      </div>
    </Modal>
  );
}
