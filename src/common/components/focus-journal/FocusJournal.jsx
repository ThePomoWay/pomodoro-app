// FocusJournal — post-pomodoro quick-capture note system with searchable journal view.
// saveJournalEntry() persists a note to localStorage under 'focusflow_journal'.
// JournalPrompt slides in after each pomo completion; auto-dismisses after 30s.
// FocusJournal modal (key J) shows all notes grouped by day with search.
// All colours via CSS variables — no hardcoded white/black.

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './FocusJournal.module.scss';

export const JOURNAL_LS_KEY = 'focusflow_journal';
const MAX_ENTRIES = 200;

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function saveJournalEntry({ note, taskName = '', sessionNum = 0 }) {
  if (!note?.trim()) return;
  const entries = readJournalEntries();
  const entry = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    note: note.trim(),
    taskName: (taskName || '').trim(),
    sessionNum,
  };
  entries.unshift(entry);
  try {
    localStorage.setItem(JOURNAL_LS_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch (_) {}
}

export function readJournalEntries() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_LS_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDayLabel(ts) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (sameCalendarDay(d, today)) return 'Today';
  if (sameCalendarDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

function groupByDay(entries) {
  const groups = [];
  let lastKey = null;
  for (const entry of entries) {
    const d = new Date(entry.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (key !== lastKey) {
      groups.push({ label: formatDayLabel(entry.timestamp), entries: [] });
      lastKey = key;
    }
    groups[groups.length - 1].entries.push(entry);
  }
  return groups;
}

// ─── FocusJournal modal ───────────────────────────────────────────────────────

export function FocusJournal({ open, onClose }) {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      setEntries(readJournalEntries());
      setSearch('');
    }
  }, [open]);

  const filtered = search.trim()
    ? entries.filter(
        (e) =>
          e.note.toLowerCase().includes(search.toLowerCase()) ||
          (e.taskName || '').toLowerCase().includes(search.toLowerCase()),
      )
    : entries;

  const groups = groupByDay(filtered);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Focus Journal"
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>📖</div>
          <div>
            <h2 className={styles.title}>Focus Journal</h2>
            <p className={styles.subtitle}>
              {entries.length} session {entries.length === 1 ? 'note' : 'notes'} captured
            </p>
          </div>
        </div>

        {/* Search — only shown when worth searching */}
        {entries.length > 3 && (
          <div className={styles.searchBar}>
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <line
                x1="10"
                y1="10"
                x2="14"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Search journal notes"
            />
          </div>
        )}

        {/* Entry list / empty state */}
        {groups.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>✍️</div>
            <p className={styles.emptyTitle}>
              {search ? 'No matching notes' : 'No journal entries yet'}
            </p>
            <p className={styles.emptyHint}>
              {search
                ? 'Try a different search term.'
                : 'After each pomodoro, a prompt invites you to capture what you accomplished. Your notes appear here.'}
            </p>
          </div>
        ) : (
          <div className={styles.groups}>
            {groups.map((group) => (
              <div key={group.label} className={styles.dayGroup}>
                <div className={styles.dayLabel}>{group.label}</div>
                <div className={styles.entryList}>
                  {group.entries.map((entry, i) => (
                    <div
                      key={entry.id}
                      className={styles.entry}
                      style={{ '--entry-idx': i }}
                    >
                      <div className={styles.entryMeta}>
                        <span className={styles.entryTime}>
                          {formatTime(entry.timestamp)}
                        </span>
                        {entry.taskName && (
                          <span className={styles.taskBadge}>
                            📌 {entry.taskName}
                          </span>
                        )}
                        {entry.sessionNum > 0 && (
                          <span className={styles.sessionBadge}>
                            #{entry.sessionNum}
                          </span>
                        )}
                      </div>
                      <p className={styles.entryNote}>{entry.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JournalPrompt — quick capture card shown after pomo completion ───────────

export function JournalPrompt({ sessionNum, taskName, onSave, onDismiss }) {
  const [note, setNote] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const inputRef = useRef(null);
  // stable ref to onDismiss so interval closure doesn't stale-capture
  const onDismissRef = useRef(onDismiss);
  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          onDismissRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = useCallback(() => {
    if (note.trim()) {
      saveJournalEntry({ note, taskName, sessionNum });
      onSave();
    } else {
      onDismiss();
    }
  }, [note, taskName, sessionNum, onSave, onDismiss]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') onDismiss();
  };

  const CIRCUMFERENCE = 2 * Math.PI * 16; // r=16
  const dashArray = `${(secondsLeft / 30) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;

  return (
    <div className={styles.promptCard} role="dialog" aria-label="Capture session note">
      {/* Countdown ring */}
      <div className={styles.promptTimer} aria-hidden="true">
        <svg viewBox="0 0 36 36" className={styles.promptTimerSvg}>
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="var(--border-navbar-theme)"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
          <text x="18" y="22.5" textAnchor="middle" fontSize="9" fill="var(--text-theme-3)">
            {secondsLeft}
          </text>
        </svg>
      </div>

      <div className={styles.promptHeader}>
        <span className={styles.promptEmoji}>✅</span>
        <div>
          <p className={styles.promptTitle}>Session {sessionNum} complete!</p>
          {taskName && (
            <p className={styles.promptTask}>📌 {taskName}</p>
          )}
        </div>
      </div>

      <p className={styles.promptHint}>What did you accomplish?</p>

      <textarea
        ref={inputRef}
        className={styles.promptInput}
        placeholder="Finished the auth flow, fixed the nav bug…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        maxLength={200}
      />

      <div className={styles.promptActions}>
        <button className={styles.skipBtn} onClick={onDismiss}>
          Skip
        </button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!note.trim()}
        >
          Save note →
        </button>
      </div>
    </div>
  );
}

// ─── Badge button (rendered in homepage) ────────────────────────────────────

export function JournalBadge({ onClick, hasNewEntry }) {
  return (
    <button
      className={`${styles.journalBadge} ${hasNewEntry ? styles.journalBadgeNew : ''}`}
      onClick={onClick}
      aria-label="Open focus journal"
      title="Focus Journal (J)"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="3" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <line x1="7" y1="7.5" x2="13" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="7" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="7" y1="13.5" x2="10.5" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
