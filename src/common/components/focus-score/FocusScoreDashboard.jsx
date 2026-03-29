// FocusScoreDashboard — circular focus score with animated breakdown.
// Score = weighted: pomos(40%) + tasks(30%) + streak(20%) + momentum(10%)
// All colours via CSS variables — no hardcoded white/black.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectTodaysTasks,
  selectTodaysCompletedTasks,
} from '../../state/selectors';
import { readHeatmapData } from '../flow-heatmap/FlowHeatmap';
import styles from './FocusScoreDashboard.module.scss';

export const DAILY_POMO_GOAL = 8;

const SCORE_LABELS = [
  { min: 95, label: 'Flow State',  color: '#818cf8' },
  { min: 80, label: 'Deep Work',   color: '#6366f1' },
  { min: 60, label: 'Focused',     color: '#34d399' },
  { min: 40, label: 'Building',    color: '#fbbf24' },
  { min: 0,  label: 'Warming Up',  color: '#94a3b8' },
];

const RING_RADIUS       = 72;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// ─── Date helpers ─────────────────────────────────────────────────────────────

function datePrefix(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function countPomos(data, prefix) {
  return Object.entries(data)
    .filter(([k]) => k.startsWith(prefix))
    .reduce((s, [, v]) => s + v, 0);
}

function calcStreak(data) {
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const count = countPomos(data, datePrefix(i));
    if (count > 0) {
      streak++;
    } else if (i === 0) {
      // today has no pomos yet — don't break streak from previous days
    } else {
      break;
    }
  }
  return streak;
}

function calcMomentum(data) {
  const now   = new Date();
  const base  = datePrefix(0);
  const h     = now.getHours();
  const key   = (hr) => `${base}-${String(hr).padStart(2, '0')}`;
  return (data[key(h)] || 0) + (h > 0 ? (data[key(h - 1)] || 0) : 0);
}

// ─── Score computation ────────────────────────────────────────────────────────

export function computeScores(data, todaysTasks, completedTasks) {
  const pomosToday     = countPomos(data, datePrefix(0));
  const pomosYesterday = countPomos(data, datePrefix(1));
  const streak         = calcStreak(data);
  const momentum       = calcMomentum(data);

  const pomoScore     = Math.min(100, Math.round((pomosToday     / DAILY_POMO_GOAL) * 100));
  const totalTasks    = todaysTasks.length + completedTasks.length;
  const taskScore     = totalTasks === 0
    ? 0
    : Math.round((completedTasks.length / totalTasks) * 100);
  const streakScore   = Math.min(100, Math.round((streak    / 7) * 100));
  const momentumScore = Math.min(100, Math.round((momentum  / 3) * 100));

  const overall = Math.round(
    pomoScore * 0.4 + taskScore * 0.3 + streakScore * 0.2 + momentumScore * 0.1,
  );

  return {
    overall,
    pomoScore,
    taskScore,
    streakScore,
    momentumScore,
    pomosToday,
    pomosYesterday,
    streak,
    momentum,
    completedCount: completedTasks.length,
    totalCount: totalTasks,
    trend: pomosYesterday > 0 ? pomosToday - pomosYesterday : null,
  };
}

function getLabel(score) {
  return SCORE_LABELS.find((s) => score >= s.min) ?? SCORE_LABELS[SCORE_LABELS.length - 1];
}

// ─── Animated counter ────────────────────────────────────────────────────────

function AnimatedCounter({ target, duration = 950 }) {
  const [val, setVal]   = useState(0);
  const rafRef          = useRef(null);
  const startRef        = useRef(null);

  useEffect(() => {
    startRef.current = null;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return <>{val}</>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FocusScoreDashboard({ open, onClose }) {
  const todaysTasks    = useSelector(selectTodaysTasks);
  const completedTasks = useSelector(selectTodaysCompletedTasks);
  const [scores, setScores]     = useState(null);
  const [animated, setAnimated] = useState(false);

  // Recompute on open
  useEffect(() => {
    if (open) {
      setAnimated(false);
      setScores(computeScores(readHeatmapData(), todaysTasks, completedTasks));
    }
  }, [open, todaysTasks, completedTasks]);

  // Trigger CSS transitions after first paint
  useEffect(() => {
    if (open && scores) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true)),
      );
    }
  }, [open, scores]);

  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open || !scores) return null;

  const {
    overall, pomoScore, taskScore, streakScore, momentumScore,
    pomosToday, streak, completedCount, totalCount, trend,
  } = scores;

  const label      = getLabel(overall);
  const dashOffset = animated
    ? RING_CIRCUMFERENCE * (1 - overall / 100)
    : RING_CIRCUMFERENCE;

  const bars = [
    { label: 'Pomodoros', value: pomoScore,     detail: `${pomosToday} / ${DAILY_POMO_GOAL} today` },
    { label: 'Tasks',     value: taskScore,     detail: `${completedCount} / ${totalCount} done`    },
    { label: 'Streak',    value: streakScore,   detail: `${streak} day${streak !== 1 ? 's' : ''} running` },
    { label: 'Momentum',  value: momentumScore, detail: 'last 2 hours'                              },
  ];

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Focus Score Dashboard"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close focus score"
        >
          ✕
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Focus Score</h2>
          <p className={styles.subtitle}>Today's productivity at a glance</p>
        </div>

        {/* ── Score ring ── */}
        <div className={styles.scoreSection}>
          <div className={styles.ringWrap}>
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              className={styles.ring}
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                cx="90" cy="90" r={RING_RADIUS}
                fill="none"
                stroke="var(--border-navbar-theme)"
                strokeWidth="10"
              />
              {/* Glow layer */}
              <circle
                cx="90" cy="90" r={RING_RADIUS}
                fill="none"
                stroke={label.color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 90 90)"
                opacity="0.15"
                className={styles.progressArc}
              />
              {/* Progress arc */}
              <circle
                cx="90" cy="90" r={RING_RADIUS}
                fill="none"
                stroke={label.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 90 90)"
                className={styles.progressArc}
              />
            </svg>

            <div className={styles.scoreInner}>
              <div className={styles.scoreNumber} style={{ color: label.color }}>
                <AnimatedCounter target={overall} />
              </div>
              <span className={styles.scoreMax}>/100</span>
              <span className={styles.scoreLabel} style={{ color: label.color }}>
                {label.label}
              </span>
            </div>
          </div>

          {/* Trend badge */}
          {trend !== null && (
            <div
              className={`${styles.trend} ${trend >= 0 ? styles.trendUp : styles.trendDown}`}
            >
              {trend >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(trend)} pomodoro{Math.abs(trend) !== 1 ? 's' : ''} vs yesterday
            </div>
          )}
        </div>

        {/* ── Breakdown bars ── */}
        <div className={styles.barsSection}>
          {bars.map((bar) => (
            <div key={bar.label} className={styles.barRow}>
              <div className={styles.barMeta}>
                <span className={styles.barLabel}>{bar.label}</span>
                <span className={styles.barDetail}>{bar.detail}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: animated ? `${bar.value}%` : '0%',
                    backgroundColor: label.color,
                  }}
                  role="progressbar"
                  aria-valuenow={bar.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${bar.label} score ${bar.value}%`}
                />
              </div>
              <span className={styles.barPct}>{bar.value}%</span>
            </div>
          ))}
        </div>

        <p className={styles.footerNote}>
          Score resets at midnight · Goal: {DAILY_POMO_GOAL} pomodoros / day
        </p>
      </div>
    </div>
  );
}
