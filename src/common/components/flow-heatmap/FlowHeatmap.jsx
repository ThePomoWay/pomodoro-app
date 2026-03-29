// FlowHeatmap — 7-day × 16-hour focus intensity grid (GitHub-contrib style).
// Records pomodoro completion timestamps in localStorage; renders on demand.
// All colours via CSS variables — no hardcoded white/black.

import { Fragment, useCallback, useEffect, useState } from 'react';
import styles from './FlowHeatmap.module.scss';

export const HEATMAP_LS_KEY = 'focusflow_heatmap';

const DISPLAY_HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7 am – 10 pm
const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Helpers ────────────────────────────────────────────────────────────────

function dateKey(date, hour) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}-${String(hour).padStart(2, '0')}`;
}

function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function formatHour(h) {
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h > 12 ? `${h - 12}pm` : `${h}am`;
}

function cellBg(intensity) {
  if (intensity === 0) return 'rgba(99, 102, 241, 0.07)';
  const alpha = Math.min(0.95, 0.2 + intensity * 0.75);
  return `rgba(99, 102, 241, ${alpha.toFixed(2)})`;
}

// ─── Public utilities ────────────────────────────────────────────────────────

/** Call once per completed pomodoro — records the hour into localStorage. */
export function recordPomoCompletion() {
  const now = new Date();
  const key = dateKey(now, now.getHours());
  try {
    const data = JSON.parse(localStorage.getItem(HEATMAP_LS_KEY) || '{}');
    data[key] = (data[key] || 0) + 1;
    localStorage.setItem(HEATMAP_LS_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — silently skip
  }
}

/** Read raw heatmap data from localStorage. */
export function readHeatmapData() {
  try {
    return JSON.parse(localStorage.getItem(HEATMAP_LS_KEY) || '{}');
  } catch {
    return {};
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FlowHeatmap({ open, onClose }) {
  const [data, setData] = useState({});
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (open) setData(readHeatmapData());
  }, [open]);

  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  const days = last7Days();
  const maxCount = Math.max(1, ...Object.values(data));

  const hourTotals = DISPLAY_HOURS.map((h) => ({
    h,
    total: days.reduce((s, d) => s + (data[dateKey(d, h)] || 0), 0),
  }));
  const peakHour = hourTotals.reduce((a, b) => (b.total > a.total ? b : a));

  const dayTotals = days.map((d) => ({
    d,
    total: DISPLAY_HOURS.reduce((s, h) => s + (data[dateKey(d, h)] || 0), 0),
  }));
  const peakDay = dayTotals.reduce((a, b) => (b.total > a.total ? b : a));

  const grandTotal = hourTotals.reduce((s, { total }) => s + total, 0);

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Flow State Heatmap"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close heatmap">
          ✕
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Flow State Heatmap</h2>
          <p className={styles.subtitle}>Your focus intensity — last 7 days</p>
        </div>

        {/* Stats strip */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{grandTotal}</span>
            <span className={styles.statLabel}>Total Pomodoros</span>
          </div>
          {peakHour.total > 0 && (
            <div className={styles.statCard}>
              <span className={styles.statValue}>{formatHour(peakHour.h)}</span>
              <span className={styles.statLabel}>Peak Focus Hour</span>
            </div>
          )}
          {peakDay.total > 0 && (
            <div className={styles.statCard}>
              <span className={styles.statValue}>{DAY_ABBR[peakDay.d.getDay()]}</span>
              <span className={styles.statLabel}>Top Day</span>
            </div>
          )}
        </div>

        {/* Heatmap grid */}
        <div className={styles.gridWrapper}>
          <div className={styles.grid}>
            {/* Corner + day headers */}
            <div className={styles.corner} />
            {days.map((d) => (
              <div key={d.toISOString()} className={styles.dayLabel}>
                <span className={styles.dayName}>{DAY_ABBR[d.getDay()]}</span>
                <span className={styles.dayNum}>{d.getDate()}</span>
              </div>
            ))}

            {/* Hour rows */}
            {DISPLAY_HOURS.map((h) => (
              <Fragment key={h}>
                <div className={styles.hourLabel}>{formatHour(h)}</div>
                {days.map((d) => {
                  const k = dateKey(d, h);
                  const count = data[k] || 0;
                  const intensity = count / maxCount;
                  const isPeakRow = peakHour.total > 0 && h === peakHour.h;
                  return (
                    <div
                      key={k}
                      className={`${styles.cell} ${isPeakRow ? styles.peakRow : ''}`}
                      style={{ background: cellBg(intensity) }}
                      onMouseEnter={() => setTooltip({ d, h, count })}
                      onMouseLeave={() => setTooltip(null)}
                      aria-label={`${count} pomodoro${count !== 1 ? 's' : ''} at ${formatHour(h)} on ${DAY_ABBR[d.getDay()]} ${d.getDate()}`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        <div className={`${styles.tooltip} ${tooltip ? styles.tooltipVisible : ''}`}>
          {tooltip
            ? tooltip.count > 0
              ? `${tooltip.count} pomodoro${tooltip.count !== 1 ? 's' : ''} · ${DAY_ABBR[tooltip.d.getDay()]} ${formatHour(tooltip.h)}`
              : `No activity · ${DAY_ABBR[tooltip.d.getDay()]} ${formatHour(tooltip.h)}`
            : '\u00A0'}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((i) => (
            <div key={i} className={styles.legendCell} style={{ background: cellBg(i) }} />
          ))}
          <span className={styles.legendLabel}>More</span>
        </div>
      </div>
    </div>
  );
}
