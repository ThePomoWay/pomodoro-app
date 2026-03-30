import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTodaysTasks } from '../../state/slice/TasksSlice';
import { selectTodaysTasks } from '../../state/selectors';
import styles from './SmartSortPanel.module.scss';

// ── Cognitive energy phases ────────────────────────────────────────────────────
const PHASES = {
  dawn:      { label: 'Dawn',      hours: [5,  7],  emoji: '🌅', accent: '#f472b6', desc: 'Ease in — lighter tasks to build momentum' },
  morning:   { label: 'Morning',   hours: [7,  12], emoji: '☀️', accent: '#fbbf24', desc: 'Peak focus — tackle your hardest tasks now' },
  midday:    { label: 'Midday',    hours: [12, 14], emoji: '🌤', accent: '#34d399', desc: 'Energy dip — quick wins keep you moving' },
  afternoon: { label: 'Afternoon', hours: [14, 18], emoji: '🌇', accent: '#818cf8', desc: 'Second wind — ideal for creative & complex work' },
  evening:   { label: 'Evening',   hours: [18, 22], emoji: '🌆', accent: '#fb923c', desc: 'Wind down — wrap up routine and admin tasks' },
  night:     { label: 'Night',     hours: [22, 29], emoji: '🌙', accent: '#94a3b8', desc: 'Rest mode — minimal cognitive load tasks only' },
};

function getPhaseKey(hour) {
  if (hour >= 5  && hour < 7)  return 'dawn';
  if (hour >= 7  && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

// Score tasks: higher = appears earlier in the suggested list
function scoreTask(task, phaseKey) {
  let score = 0;
  const priority = task.priority || 2;   // 1=high, 2=med, 3=low
  const pomos    = task.estimatedPomodoros || 1;
  const started  = (task.csec || 0) > 0;

  // In-progress tasks always bubble to the top (finish what you started)
  if (started) score += 40;

  // Priority base
  if      (priority === 1) score += 30;
  else if (priority === 2) score += 15;

  // Energy-match bonus
  if (phaseKey === 'morning' || phaseKey === 'afternoon') {
    // Peak energy — reward longer, heavier tasks
    score += Math.min(pomos, 8) * 3;
  } else if (phaseKey === 'midday' || phaseKey === 'evening' || phaseKey === 'night') {
    // Low energy — reward shorter tasks
    score += Math.max(0, 8 - Math.min(pomos, 8)) * 3;
  } else if (phaseKey === 'dawn') {
    // Dawn — medium tasks (1-3 pomos) get a small lift
    if (pomos >= 1 && pomos <= 3) score += 8;
  }

  return score;
}

function getReason(task, phaseKey) {
  const priority = task.priority || 2;
  const pomos    = task.estimatedPomodoros || 1;
  const started  = (task.csec || 0) > 0;

  if (started) return { label: '⚡ In progress', color: '#00d4ff' };
  if (priority === 1 && (phaseKey === 'morning' || phaseKey === 'afternoon'))
    return { label: '🔥 Priority + peak energy', color: '#f97316' };
  if (priority === 1)
    return { label: '🎯 High priority', color: '#f97316' };
  if ((phaseKey === 'morning' || phaseKey === 'afternoon') && pomos >= 3)
    return { label: '💪 Deep work match', color: '#8b5cf6' };
  if ((phaseKey === 'midday' || phaseKey === 'evening' || phaseKey === 'night') && pomos <= 2)
    return { label: '⚡ Quick win', color: '#10b981' };
  if (priority === 2)
    return { label: '📋 On track', color: '#6366f1' };
  return { label: '🌿 Light task', color: '#64748b' };
}

// 0-100: how far we are through the current phase (used to show energy bar)
function energyLevel(hour, phaseKey) {
  const [start, end] = PHASES[phaseKey].hours;
  const elapsed = Math.min(1, Math.max(0, (hour - start) / (end - start)));
  // Invert during recovery phases so bar looks like energy remaining
  const isPeak = phaseKey === 'morning' || phaseKey === 'afternoon';
  return isPeak ? Math.round((1 - elapsed * 0.5) * 100) : Math.round((1 - elapsed * 0.7) * 100);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function SmartSortPanel({ open, onClose }) {
  const dispatch  = useDispatch();
  const tasks     = useSelector(selectTodaysTasks);
  const [applied, setApplied] = useState(false);

  const now      = new Date();
  const hour     = now.getHours() + now.getMinutes() / 60;
  const phaseKey = getPhaseKey(hour);
  const phase    = PHASES[phaseKey];
  const timeStr  = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const nrgPct   = energyLevel(hour, phaseKey);

  const sortedItems = useMemo(() => {
    return [...tasks]
      .map(t => ({ task: t, score: scoreTask(t, phaseKey), reason: getReason(t, phaseKey) }))
      .sort((a, b) => b.score - a.score);
  }, [tasks, phaseKey]);

  const isAlreadySorted = useMemo(() => {
    if (!tasks.length) return true;
    return sortedItems.every((item, i) => item.task.fid === tasks[i]?.fid);
  }, [tasks, sortedItems]);

  useEffect(() => { if (open) setApplied(false); }, [open]);

  if (!open) return null;

  const handleApply = () => {
    const newOrder = sortedItems.map(({ task }) => task.fid);
    dispatch(updateTodaysTasks(newOrder));
    setApplied(true);
    setTimeout(onClose, 900);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Smart Sort Panel"
    >
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close Smart Sort">✕</button>

        {/* ── Header ── */}
        <div className={styles.header}>
          <span className={styles.headerEmoji} aria-hidden="true">{phase.emoji}</span>
          <div className={styles.headerText}>
            <div className={styles.headerTitle}>Smart Sort</div>
            <div className={styles.headerSub}>{timeStr} · {phase.label} phase</div>
          </div>
          <div className={styles.phaseChip} style={{ '--phase-color': phase.accent }}>
            {phase.label}
          </div>
        </div>

        {/* ── Energy meter ── */}
        <div className={styles.energySection}>
          <div className={styles.energyRow}>
            <span className={styles.energyLabel}>Cognitive energy</span>
            <span className={styles.energyPct} style={{ color: phase.accent }}>{nrgPct}%</span>
          </div>
          <div className={styles.energyTrack}>
            <div
              className={styles.energyFill}
              style={{ width: `${nrgPct}%`, '--phase-color': phase.accent }}
            />
          </div>
          <div className={styles.phaseDesc}>{phase.desc}</div>
        </div>

        {/* ── Task list ── */}
        {tasks.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyEmoji}>📋</div>
            <p className={styles.emptyTitle}>No tasks for today</p>
            <p className={styles.emptySub}>Add tasks and Smart Sort will suggest the optimal order based on your current energy level.</p>
          </div>
        ) : (
          <>
            <div className={styles.listHeader}>
              <span>Suggested order</span>
              {isAlreadySorted && (
                <span className={styles.alreadyOptimal}>✓ Already optimal</span>
              )}
            </div>

            <ol className={styles.taskList} aria-label="Suggested task order">
              {sortedItems.map(({ task, reason }, idx) => (
                <li key={task.fid} className={styles.taskRow}>
                  <div className={styles.rankBubble} aria-hidden="true">{idx + 1}</div>
                  <div className={styles.taskContent}>
                    <div className={styles.taskTitle}>{task.title || 'Untitled task'}</div>
                    <div className={styles.taskMeta}>
                      {(task.estimatedPomodoros || 0) > 0 && (
                        <span className={styles.pomoPill}>🍅 {task.estimatedPomodoros}</span>
                      )}
                      <span
                        className={styles.reasonBadge}
                        style={{ '--reason-color': reason.color }}
                      >
                        {reason.label}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* ── Actions ── */}
            <div className={styles.actions}>
              {applied ? (
                <div className={styles.appliedMsg} role="status">✓ Tasks reordered!</div>
              ) : isAlreadySorted ? (
                <button className={styles.btnSecondary} onClick={onClose}>
                  Keep current order
                </button>
              ) : (
                <>
                  <button
                    className={styles.btnPrimary}
                    style={{ '--phase-color': phase.accent }}
                    onClick={handleApply}
                  >
                    Apply Smart Sort
                  </button>
                  <button className={styles.btnSecondary} onClick={onClose}>
                    Keep current
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
