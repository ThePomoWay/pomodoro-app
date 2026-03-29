import { useEffect, useRef, useState } from "react";
import styles from "./BreathingExercise.module.scss";

const PHASES = [
  { name: "inhale", label: "Breathe in...", duration: 4000, animation: "inhale" },
  { name: "hold",   label: "Hold...",       duration: 7000, animation: "hold"   },
  { name: "exhale", label: "Breathe out...", duration: 8000, animation: "exhale" },
];

const TOTAL_ROUNDS = 3;

export function BreathingExercise({ onDismiss }) {
  const [round, setRound]         = useState(1);
  const [phaseIdx, setPhaseIdx]   = useState(0);
  const timerRef                  = useRef(null);

  const phase = PHASES[phaseIdx];

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const nextIdx = (phaseIdx + 1) % PHASES.length;
      const completingRound = phaseIdx === PHASES.length - 1;

      if (completingRound) {
        if (round >= TOTAL_ROUNDS) {
          onDismiss();
          return;
        }
        setRound((r) => r + 1);
      }
      setPhaseIdx(nextIdx);
    }, phase.duration);

    return () => clearTimeout(timerRef.current);
  }, [phaseIdx, round, onDismiss, phase.duration]);

  return (
    <div className={styles.container} role="dialog" aria-label="Breathing exercise">
      <div className={styles.inner}>
        <h2 className={styles.title}>Mindful Breathing</h2>

        <div
          className={`${styles.orb} ${styles[`orb--${phase.animation}`]}`}
          aria-hidden="true"
        />

        <p className={styles.phaseText}>{phase.label}</p>
        <p className={styles.subText}>
          Round {round} of {TOTAL_ROUNDS}
        </p>

        <p className={styles.techniqueLabel}>4 — 7 — 8 technique</p>

        <button
          className={styles.skipBtn}
          onClick={onDismiss}
          aria-label="Skip breathing exercise"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
