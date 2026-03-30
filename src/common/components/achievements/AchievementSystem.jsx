// AchievementSystem — Trophy Case with unlockable achievement badges.
// Data sourced from localStorage heatmap + evaluates milestones.
// All colours via CSS variables — no hardcoded white/black.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { readHeatmapData } from '../flow-heatmap/FlowHeatmap';
import styles from './AchievementSystem.module.scss';

// ─── Storage ──────────────────────────────────────────────────────────────────

export const ACHIEVEMENTS_LS_KEY = 'focusflow_achievements';

export function readAchievements() {
  try {
    return JSON.parse(localStorage.getItem(ACHIEVEMENTS_LS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAchievements(data) {
  try {
    localStorage.setItem(ACHIEVEMENTS_LS_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — silently skip
  }
}

// ─── Achievement Definitions ──────────────────────────────────────────────────

export const ACHIEVEMENT_DEFS = [
  {
    id: 'first-flame',
    icon: '🔥',
    name: 'First Flame',
    desc: 'Complete your very first pomodoro.',
    color: '#f97316',
  },
  {
    id: 'getting-started',
    icon: '⚡',
    name: 'Getting Started',
    desc: 'Complete 5 pomodoros total.',
    color: '#eab308',
  },
  {
    id: 'focus-block',
    icon: '🟣',
    name: 'Focus Block',
    desc: 'Complete 4 pomodoros in a single day.',
    color: '#a855f7',
  },
  {
    id: 'power-day',
    icon: '💪',
    name: 'Power Day',
    desc: 'Complete 8 pomodoros in a single day.',
    color: '#ec4899',
  },
  {
    id: 'dedicated',
    icon: '🎯',
    name: 'Dedicated',
    desc: 'Complete 25 pomodoros total.',
    color: '#3b82f6',
  },
  {
    id: 'half-century',
    icon: '⭐',
    name: 'Half Century',
    desc: 'Complete 50 pomodoros total.',
    color: '#06b6d4',
  },
  {
    id: 'centurion',
    icon: '🏆',
    name: 'Centurion',
    desc: 'Complete 100 pomodoros total.',
    color: '#f59e0b',
  },
  {
    id: 'three-day-habit',
    icon: '📅',
    name: 'Three-Day Habit',
    desc: 'Use the app for 3 consecutive days.',
    color: '#10b981',
  },
  {
    id: 'night-owl',
    icon: '🦉',
    name: 'Night Owl',
    desc: 'Complete a pomodoro between 10 pm and midnight.',
    color: '#6366f1',
  },
  {
    id: 'early-bird',
    icon: '🌅',
    name: 'Early Bird',
    desc: 'Complete a pomodoro before 7 am.',
    color: '#fb923c',
  },
];

// ─── Achievement Evaluation ───────────────────────────────────────────────────

/**
 * Given raw heatmap data ({ "YYYY-MM-DD-HH": count }),
 * returns a Set<string> of achievement IDs that should be unlocked.
 */
export function evaluateAchievements(heatmapData) {
  const unlocked = new Set();
  let totalPomos = 0;
  const dayTotals = {};
  let hasNightPomo = false;
  let hasEarlyPomo = false;

  for (const [key, count] of Object.entries(heatmapData)) {
    const num = Number(count) || 0;
    totalPomos += num;
    const parts = key.split('-'); // ["YYYY", "MM", "DD", "HH"]
    if (parts.length < 4) continue;
    const dayKey = parts.slice(0, 3).join('-');
    const hour = parseInt(parts[3], 10);
    dayTotals[dayKey] = (dayTotals[dayKey] || 0) + num;
    if (hour >= 22) hasNightPomo = true;
    if (hour < 7) hasEarlyPomo = true;
  }

  // Total milestones
  if (totalPomos >= 1) unlocked.add('first-flame');
  if (totalPomos >= 5) unlocked.add('getting-started');
  if (totalPomos >= 25) unlocked.add('dedicated');
  if (totalPomos >= 50) unlocked.add('half-century');
  if (totalPomos >= 100) unlocked.add('centurion');

  // Daily milestones
  for (const dayCount of Object.values(dayTotals)) {
    if (dayCount >= 4) unlocked.add('focus-block');
    if (dayCount >= 8) unlocked.add('power-day');
  }

  // Consecutive-day streak (3+)
  const sortedDays = Object.keys(dayTotals).sort();
  let streak = 1;
  let maxStreak = sortedDays.length > 0 ? 1 : 0;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diffMs = curr - prev;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      if (streak > maxStreak) maxStreak = streak;
    } else {
      streak = 1;
    }
  }
  if (maxStreak >= 3) unlocked.add('three-day-habit');

  // Time-of-day
  if (hasNightPomo) unlocked.add('night-owl');
  if (hasEarlyPomo) unlocked.add('early-bird');

  return unlocked;
}

/**
 * Check heatmap data for new achievements vs stored state.
 * Persists newly unlocked achievements and returns their definitions.
 */
export function checkAndUnlockAchievements() {
  const heatmapData = readHeatmapData();
  const shouldBeUnlocked = evaluateAchievements(heatmapData);
  const stored = readAchievements();
  const newlyUnlocked = [];

  for (const id of shouldBeUnlocked) {
    if (!stored[id]?.unlocked) {
      stored[id] = { unlocked: true, unlockedAt: new Date().toISOString() };
      const def = ACHIEVEMENT_DEFS.find((d) => d.id === id);
      if (def) newlyUnlocked.push(def);
    }
  }

  if (newlyUnlocked.length > 0) saveAchievements(stored);
  return newlyUnlocked;
}

// ─── Trophy Case Modal ────────────────────────────────────────────────────────

export function AchievementSystem({ open, onClose }) {
  const stored = useMemo(() => readAchievements(), [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  const unlockedCount = ACHIEVEMENT_DEFS.filter((d) => stored[d.id]?.unlocked).length;
  const pct = ACHIEVEMENT_DEFS.length > 0
    ? Math.round((unlockedCount / ACHIEVEMENT_DEFS.length) * 100)
    : 0;

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Achievement Trophy Case"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close achievements">
          ✕
        </button>

        <div className={styles.header}>
          <span className={styles.headerIcon} aria-hidden="true">🏆</span>
          <div>
            <h2 className={styles.title}>Trophy Case</h2>
            <p className={styles.subtitle}>
              {unlockedCount} / {ACHIEVEMENT_DEFS.length} achievements unlocked
            </p>
          </div>
        </div>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Overall achievement progress"
        >
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>

        <div className={styles.grid}>
          {ACHIEVEMENT_DEFS.map((def) => {
            const isUnlocked = Boolean(stored[def.id]?.unlocked);
            const unlockedAt = stored[def.id]?.unlockedAt;
            const dateLabel = isUnlocked && unlockedAt
              ? `Unlocked ${new Date(unlockedAt).toLocaleDateString()}`
              : 'Not yet unlocked';

            return (
              <div
                key={def.id}
                className={`${styles.badge} ${isUnlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                style={isUnlocked ? { '--badge-color': def.color } : undefined}
                title={dateLabel}
                aria-label={`${def.name}: ${def.desc} — ${dateLabel}`}
              >
                <span className={styles.badgeIcon} aria-hidden="true">
                  {isUnlocked ? def.icon : '🔒'}
                </span>
                <span className={styles.badgeName}>{def.name}</span>
                <span className={styles.badgeDesc}>{def.desc}</span>
                {isUnlocked && (
                  <span className={styles.badgeCheck} aria-hidden="true">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Unlock Toast ─────────────────────────────────────────────────────────────

export function AchievementToast({ achievements, onViewAll, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const achievement = achievements[0];

  useEffect(() => {
    if (!achievement) return;
    const exitTimer = setTimeout(() => setExiting(true), 3800);
    const doneTimer = setTimeout(() => { setExiting(false); onDismiss(); }, 4300);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      className={`${styles.toast} ${exiting ? styles.toastExit : styles.toastEnter}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.toastIcon} aria-hidden="true">
        {achievement.icon}
      </span>
      <div className={styles.toastContent}>
        <div className={styles.toastLabel}>Achievement Unlocked!</div>
        <div className={styles.toastName}>{achievement.name}</div>
      </div>
      <button className={styles.toastViewBtn} onClick={onViewAll} aria-label="View all achievements">
        View →
      </button>
    </div>
  );
}
