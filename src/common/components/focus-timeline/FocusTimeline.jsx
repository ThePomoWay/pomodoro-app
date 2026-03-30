// FocusTimeline — Daily chronological timeline of today's completed pomodoro sessions.
// Shows time-of-day colour coding, flow streak detection, and session stats.
// Triggered by pressing T or clicking the timeline badge.
// All colours via CSS variables — no hardcoded white/black.

import { useCallback, useEffect, useState } from 'react';
import styles from './FocusTimeline.module.scss';

export const TIMELINE_LS_KEY = 'focusflow_sessions';
const DEFAULT_DURATION = 25; // minutes
const FLOW_GAP_MS = 90 * 60 * 1000; // 90 minutes between sessions = flow streak
const FLOW_MIN_LENGTH = 3;           // minimum sessions to be called "flow"

// ─── Storage helpers ──────────────────────────────────────────────────────────

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function readSessions() {
  try {
    const raw = localStorage.getItem(TIMELINE_LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSessions(data) {
  try {
    localStorage.setItem(TIMELINE_LS_KEY, JSON.stringify(data));
  } catch { /* storage unavailable */ }
}

/** Call once per completed pomodoro. Optionally pass the current task name. */
export function recordFocusSession(taskName = '') {
  const data = readSessions();
  const key = todayKey();
  const sessions = data[key] || [];
  sessions.push({ ts: Date.now(), duration: DEFAULT_DURATION, task: taskName });
  data[key] = sessions;
  writeSessions(data);
}

function getTodaySessions() {
  const data = readSessions();
  return (data[todayKey()] || []).slice().sort((a, b) => a.ts - b.ts);
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatTime(ts) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ─── Time-of-day context ──────────────────────────────────────────────────────

function getTimeContext(ts) {
  const h = new Date(ts).getHours();
  if (h >= 5 && h < 8)   return { label: 'Dawn',      color: '#f472b6', accent: 'rgba(244,114,182,0.15)' };
  if (h >= 8 && h < 12)  return { label: 'Morning',   color: '#60a5fa', accent: 'rgba(96,165,250,0.15)'  };
  if (h >= 12 && h < 14) return { label: 'Midday',    color: '#fbbf24', accent: 'rgba(251,191,36,0.15)'  };
  if (h >= 14 && h < 18) return { label: 'Afternoon', color: '#fb923c', accent: 'rgba(251,146,60,0.15)'  };
  if (h >= 18 && h < 22) return { label: 'Evening',   color: '#a78bfa', accent: 'rgba(167,139,250,0.15)' };
  return                         { label: 'Night',     color: '#818cf8', accent: 'rgba(129,140,248,0.15)' };
}

// ─── Flow streak detection ────────────────────────────────────────────────────

function detectFlowStreaks(sessions) {
  const flowIndices = new Set();
  if (sessions.length < FLOW_MIN_LENGTH) return flowIndices;
  let streak = [0];
  for (let i = 1; i < sessions.length; i++) {
    if (sessions[i].ts - sessions[i - 1].ts <= FLOW_GAP_MS) {
      streak.push(i);
    } else {
      if (streak.length >= FLOW_MIN_LENGTH) streak.forEach(idx => flowIndices.add(idx));
      streak = [i];
    }
  }
  if (streak.length >= FLOW_MIN_LENGTH) streak.forEach(idx => flowIndices.add(idx));
  return flowIndices;
}

function getLongestStreak(sessions) {
  if (sessions.length === 0) return 0;
  let max = 1, cur = 1;
  for (let i = 1; i < sessions.length; i++) {
    if (sessions[i].ts - sessions[i - 1].ts <= FLOW_GAP_MS) {
      cur++;
      if (cur > max) max = cur;
    } else {
      cur = 1;
    }
  }
  return max;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FocusTimeline({ open, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(() => {
    setSessions(getTodaySessions());
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  // Live clock ticks every 30s while open
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  const flowIndices = detectFlowStreaks(sessions);
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || DEFAULT_DURATION), 0);
  const longestStreak = getLongestStreak(sessions);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-label="Daily Focus Timeline"
    >
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>⏱</span>
            <div>
              <h2 className={styles.title}>Daily Focus Timeline</h2>
              <p className={styles.subtitle}>{today}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────────── */}
        <div className={styles.statsStrip}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{sessions.length}</span>
            <span className={styles.statLabel}>Sessions</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{sessions.length ? formatDuration(totalMinutes) : '—'}</span>
            <span className={styles.statLabel}>Focus Time</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{longestStreak > 1 ? `${longestStreak}×` : '—'}</span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{flowIndices.size > 0 ? '🔥' : '—'}</span>
            <span className={styles.statLabel}>Flow State</span>
          </div>
        </div>

        {/* ── Timeline body ─────────────────────────────────────────────── */}
        <div className={styles.timelineBody}>
          {sessions.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎯</div>
              <p className={styles.emptyTitle}>No sessions yet today</p>
              <p className={styles.emptyHint}>
                Complete your first pomodoro to see your focus timeline here.
              </p>
            </div>
          ) : (
            <div className={styles.timeline}>
              {sessions.map((session, i) => {
                const ctx = getTimeContext(session.ts);
                const isFlow = flowIndices.has(i);
                const isLast = i === sessions.length - 1;
                const nextIsFlow = flowIndices.has(i + 1);

                return (
                  <div
                    key={`${session.ts}-${i}`}
                    className={`${styles.sessionRow} ${isFlow ? styles.flowRow : ''}`}
                    style={{
                      '--node-color': ctx.color,
                      '--node-accent': ctx.accent,
                      animationDelay: `${i * 55}ms`,
                    }}
                  >
                    {/* Vertical connector line */}
                    {!isLast && (
                      <div
                        className={`${styles.connector} ${isFlow && nextIsFlow ? styles.flowConnector : ''}`}
                      />
                    )}

                    {/* Node circle */}
                    <div
                      className={styles.node}
                      style={{
                        borderColor: ctx.color,
                        boxShadow: isFlow ? `0 0 10px ${ctx.color}55` : 'none',
                      }}
                    >
                      {isFlow && <div className={styles.flowRing} />}
                      <span className={styles.nodeNum}>{i + 1}</span>
                    </div>

                    {/* Session card */}
                    <div className={styles.sessionContent}>
                      <div className={styles.sessionHeader}>
                        <span className={styles.sessionTime}>{formatTime(session.ts)}</span>
                        <span
                          className={styles.sessionBadge}
                          style={{ background: ctx.accent, color: ctx.color }}
                        >
                          {ctx.label}
                        </span>
                        {isFlow && (
                          <span className={styles.flowBadge}>🔥 Flow</span>
                        )}
                      </div>
                      <div className={styles.sessionMeta}>
                        <span className={styles.duration}>
                          ⏱ {session.duration || DEFAULT_DURATION} min
                        </span>
                        {session.task && (
                          <span className={styles.taskName}>📌 {session.task}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* "Now" live marker */}
              <div className={styles.nowMarker}>
                <div className={styles.nowDot} />
                <span className={styles.nowLabel}>Now&nbsp;·&nbsp;{formatTime(now)}</span>
              </div>
            </div>
          )}

          {/* "Now" always-visible marker when empty */}
          {sessions.length === 0 && (
            <div className={styles.nowMarker} style={{ paddingTop: '0.5rem' }}>
              <div className={styles.nowDot} />
              <span className={styles.nowLabel}>Now&nbsp;·&nbsp;{formatTime(now)}</span>
            </div>
          )}
        </div>

        <p className={styles.hint}>
          Press <kbd>T</kbd> to toggle · <kbd>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
