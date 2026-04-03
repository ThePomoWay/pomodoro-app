// DistractionTally — floating tap counter for logging distractions during pomodoros,
// plus an analytics panel with 7-day chart, session breakdown, and category tracking.
// Triggered by pressing D or clicking the panel badge. All colours via CSS variables.

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DistractionTally.module.scss';

export const DISTRACTION_LS_KEY = 'focusflow_distractions';

const CATS = [
  { key: 'phone',        label: 'Phone',        icon: '📱' },
  { key: 'thoughts',     label: 'Thoughts',     icon: '💭' },
  { key: 'colleague',    label: 'Colleague',    icon: '👥' },
  { key: 'notification', label: 'Notification', icon: '🔔' },
  { key: 'other',        label: 'Other',        icon: '✦'  },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function readData() {
  try {
    const raw = localStorage.getItem(DISTRACTION_LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeData(data) {
  try {
    localStorage.setItem(DISTRACTION_LS_KEY, JSON.stringify(data));
  } catch { /* storage unavailable */ }
}

export function saveDistractionSession(sessionNum, count, cats) {
  if (count === 0) return;
  const data = readData();
  const key = todayKey();
  if (!data[key]) data[key] = [];
  const existing = data[key].findIndex((s) => s.sessionNum === sessionNum);
  const entry = { sessionNum, ts: Date.now(), count, cats: { ...cats } };
  if (existing >= 0) data[key][existing] = entry;
  else data[key].push(entry);
  writeData(data);
}

export function getDistractionHistory() {
  const data = readData();
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const sessions = data[key] || [];
    const total = sessions.reduce((s, e) => s + e.count, 0);
    result.push({ key, date: new Date(d), sessions, total });
  }
  return result;
}

// ─── Floating tally counter ───────────────────────────────────────────────────

export function DistractionCounter({ sessionNum }) {
  const [count, setCount] = useState(0);
  const [cats, setCats] = useState({});
  const [showCats, setShowCats] = useState(false);
  const [pulse, setPulse] = useState(false);
  const prevSessionRef = useRef(sessionNum);
  const catTimerRef = useRef(null);

  useEffect(() => {
    if (sessionNum > prevSessionRef.current) {
      saveDistractionSession(prevSessionRef.current, count, cats);
      setCount(0);
      setCats({});
      setShowCats(false);
    }
    prevSessionRef.current = sessionNum;
  }, [sessionNum]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTap() {
    const next = count + 1;
    setCount(next);
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
    setShowCats(true);
    if (catTimerRef.current) clearTimeout(catTimerRef.current);
    catTimerRef.current = setTimeout(() => setShowCats(false), 3000);
  }

  function handleCatSelect(cat) {
    setCats((prev) => ({ ...prev, [cat]: (prev[cat] || 0) + 1 }));
    if (catTimerRef.current) clearTimeout(catTimerRef.current);
    setShowCats(false);
  }

  useEffect(() => () => { if (catTimerRef.current) clearTimeout(catTimerRef.current); }, []);

  return (
    <div className={styles.counterWrap}>
      {showCats && (
        <div className={styles.catPopover} role="menu" aria-label="Distraction categories">
          <div className={styles.catTitle}>What distracted you?</div>
          <div className={styles.catGrid}>
            {CATS.map((c) => (
              <button key={c.key} className={styles.catItem} onClick={() => handleCatSelect(c.key)}>
                <span aria-hidden="true">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
          <button className={styles.catSkip} onClick={() => setShowCats(false)}>
            Skip
          </button>
        </div>
      )}
      <button
        className={`${styles.tallyBtn} ${pulse ? styles.pulse : ''}`}
        onClick={handleTap}
        title="Log distraction — D for analytics"
        aria-label="Log distraction"
      >
        <svg viewBox="0 0 20 20" className={styles.tallyIcon} aria-hidden="true">
          <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        {count > 0 && <span className={styles.tallyCount}>{count}</span>}
      </button>
    </div>
  );
}

// ─── Analytics panel ──────────────────────────────────────────────────────────

export function DistractionPanel({ open, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (open) setHistory(getDistractionHistory());
  }, [open]);

  if (!open) return null;

  const today = history[history.length - 1] || { sessions: [], total: 0 };
  const allSessions = history.flatMap((d) => d.sessions);
  const totalWeek = history.reduce((s, d) => s + d.total, 0);
  const avgPerSession = allSessions.length > 0
    ? (totalWeek / allSessions.length).toFixed(1)
    : '–';
  const bestSession = allSessions.length > 0
    ? Math.min(...allSessions.map((s) => s.count))
    : null;

  const catTotals = {};
  allSessions.forEach((s) => {
    Object.entries(s.cats || {}).forEach(([k, v]) => {
      catTotals[k] = (catTotals[k] || 0) + v;
    });
  });
  const maxCat = Math.max(...Object.values(catTotals), 1);

  const maxDay = Math.max(...history.map((d) => d.total), 1);
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const avgNum = parseFloat(avgPerSession);
  const tip = !allSessions.length ? null
    : avgNum <= 2
    ? 'Excellent focus! Under 2 distractions per session is world-class.'
    : avgNum <= 4
    ? 'Solid focus. Try ambient sounds or silence to push below 2 per session.'
    : 'High distraction rate detected. Eliminate notifications and batch communication to reclaim deep work time.';

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.panel} role="dialog" aria-label="Distraction Analytics">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className={styles.title}>
          <span className={styles.titleIcon} aria-hidden="true">✗</span>
          Distraction Analytics
        </h2>

        {/* Stats strip */}
        <div className={styles.statsStrip}>
          <div className={styles.stat}>
            <div className={styles.statVal}>{today.total}</div>
            <div className={styles.statLbl}>today</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>{totalWeek}</div>
            <div className={styles.statLbl}>this week</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>{avgPerSession}</div>
            <div className={styles.statLbl}>avg / session</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>{bestSession !== null ? bestSession : '–'}</div>
            <div className={styles.statLbl}>best session</div>
          </div>
        </div>

        {/* 7-day bar chart */}
        <div className={styles.sectionLabel}>7-Day Overview</div>
        <div className={styles.barChart} aria-label="7-day distraction bar chart">
          {history.map((day, i) => {
            const pct = (day.total / maxDay) * 100;
            const isToday = i === history.length - 1;
            const label = DAY_LABELS[day.date.getDay()];
            return (
              <div
                key={day.key}
                className={`${styles.barCol} ${isToday ? styles.barToday : ''}`}
              >
                <div className={styles.barWrap}>
                  <div
                    className={styles.bar}
                    style={{ height: `${day.total > 0 ? Math.max(pct, 6) : 0}%` }}
                  />
                </div>
                <div className={styles.barLabel}>{isToday ? 'Today' : label}</div>
                <div className={styles.barCount}>{day.total > 0 ? day.total : ''}</div>
              </div>
            );
          })}
        </div>

        {/* Today's sessions */}
        {today.sessions.length > 0 && (
          <>
            <div className={styles.sectionLabel}>Today's Sessions</div>
            <div className={styles.sessionList}>
              {today.sessions.map((s, i) => {
                const q = s.count === 0 ? 'perfect' : s.count <= 2 ? 'good' : s.count <= 5 ? 'fair' : 'tough';
                const qLabel = { perfect: '★ Perfect', good: '✓ Good', fair: '~ Fair', tough: '✗ Tough' }[q];
                return (
                  <div key={i} className={`${styles.sessionRow} ${styles['session_' + q]}`}>
                    <span className={styles.sessionNum}>#{s.sessionNum}</span>
                    <div className={styles.sessionBar}>
                      <div
                        className={styles.sessionFill}
                        style={{ width: `${Math.min((s.count / 8) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={styles.sessionCount}>{s.count} ✗</span>
                    <span className={`${styles.sessionBadge} ${styles['badge_' + q]}`}>
                      {qLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Category breakdown */}
        {Object.keys(catTotals).length > 0 && (
          <>
            <div className={styles.sectionLabel}>Top Distractions</div>
            <div className={styles.catBreakdown}>
              {CATS.filter((c) => catTotals[c.key] > 0)
                .sort((a, b) => (catTotals[b.key] || 0) - (catTotals[a.key] || 0))
                .map((c) => (
                  <div key={c.key} className={styles.catBreakRow}>
                    <span className={styles.catBreakIcon} aria-hidden="true">{c.icon}</span>
                    <span className={styles.catBreakLabel}>{c.label}</span>
                    <div className={styles.catBreakBar}>
                      <div
                        className={styles.catBreakFill}
                        style={{ width: `${(catTotals[c.key] / maxCat) * 100}%` }}
                      />
                    </div>
                    <span className={styles.catBreakCount}>{catTotals[c.key]}</span>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {allSessions.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">✓</div>
            <div className={styles.emptyTitle}>Zero distractions logged</div>
            <div className={styles.emptyText}>
              Tap the ✗ button during a pomodoro whenever you get distracted.
              <br />
              Track patterns and eliminate your biggest focus killers over time.
            </div>
          </div>
        )}

        {/* Insight tip */}
        {tip && (
          <div className={styles.tip}>
            <span className={styles.tipIcon} aria-hidden="true">💡</span>
            {tip}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Panel badge (export class for homepage) ──────────────────────────────────
export { styles as distractionStyles };
