import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCompletedPomos } from '../../state/selectors';
import styles from './MotivationalWidget.module.scss';

// ─── Time context keys ────────────────────────────────────────────────────────
export const CTX_DAWN      = 'dawn';
export const CTX_MORNING   = 'morning';
export const CTX_NOON      = 'noon';
export const CTX_AFTERNOON = 'afternoon';
export const CTX_EVENING   = 'evening';
export const CTX_NIGHT     = 'night';

// ─── Message bank ─────────────────────────────────────────────────────────────
// Keys: context → pomo tier (0 | 'low' | 'mid' | 'high')
export const MESSAGE_BANK = {
  [CTX_DAWN]: {
    0:      ["You're up early — your future self will thank you.",
             "Dawn belongs to those who dare.",
             "The quiet hours are yours to own."],
    low:    ["First pomo of the day. You've already won.",
             "Sunrise and focused work: a rare combination.",
             "Most people are still asleep. You're already building."],
    mid:    ["You're setting the tone for the entire day.",
             "Deep work at dawn — that's a superpower.",
             "Morning focus carries momentum into everything else."],
    high:   ["By noon you'll have done what most do all day.",
             "This is elite-level morning discipline.",
             "Sunrise sessions are the compounding interest of productivity."],
  },
  [CTX_MORNING]: {
    0:      ["Peak cognitive hours are here — let's use them.",
             "Morning energy is premium fuel. Don't waste it.",
             "Your brain is sharpest right now."],
    low:    ["You caught the best hours of the day.",
             "Morning focus is worth double.",
             "The first deep-work block is the hardest and most rewarding."],
    mid:    ["You're in your stride. Keep the rhythm.",
             "This is what consistency looks like.",
             "Morning momentum compounds through the whole day."],
    high:   ["You've done more meaningful work this morning than most do all week.",
             "This is a genuinely great start.",
             "The scorecard already looks excellent."],
  },
  [CTX_NOON]: {
    0:      ["Midday check-in: even one focused block sets you up.",
             "Noon is a second chance to start strong.",
             "A post-lunch pomo fights the slump before it starts."],
    low:    ["Midday focus — underrated and powerful.",
             "You're outpacing the post-lunch dip.",
             "One good block now and the afternoon is yours."],
    mid:    ["Consistent all the way to midday — impressive.",
             "You've maintained quality through the morning.",
             "Energy's dipping for most people. Not for you."],
    high:   ["Half a day of deep work. That's genuinely rare.",
             "You've earned a proper break.",
             "Midday and already at full capacity."],
  },
  [CTX_AFTERNOON]: {
    0:      ["The afternoon comeback is one of the best feelings.",
             "A single focused block now beats zero.",
             "Post-3pm work is surprisingly good when you're in flow."],
    low:    ["Every pomo in the afternoon is extra credit.",
             "Afternoon focus takes real discipline.",
             "You're ahead of the 3pm slump."],
    mid:    ["A full afternoon of solid work. That's a win.",
             "You've maintained focus when most drop off.",
             "Afternoon consistency is rare. You have it."],
    high:   ["You've been in deep work most of the day. Elite.",
             "This is a genuinely productive day.",
             "The afternoon push will show up in your results."],
  },
  [CTX_EVENING]: {
    0:      ["Evening sessions are perfect for creative work.",
             "The day isn't over — one strong block left.",
             "Evening quiet creates space for real thinking."],
    low:    ["Starting strong in the evening.",
             "Evening momentum often surprises you.",
             "The best ideas come after everyone else logs off."],
    mid:    ["A solid evening of work to close out the day.",
             "You're finishing strong.",
             "The discipline to work evenings well is rare."],
    high:   ["This has been an exceptional day of deep work.",
             "You've earned tomorrow's momentum.",
             "Evening and still deep in it — legendary."],
  },
  [CTX_NIGHT]: {
    0:      ["Night owl mode — ideal for uninterrupted thinking.",
             "The quiet of night is a productivity gift.",
             "Late nights and big ideas go well together."],
    low:    ["Into the night session — you're serious about this.",
             "The late hours are yours to shape.",
             "Night focus is pure signal with no noise."],
    mid:    ["Burning deep into the night — respect.",
             "Your nighttime streak is impressive.",
             "Most have stopped. You're still going."],
    high:   ["An extraordinary day and night of deep work.",
             "You've found a rare gear tonight.",
             "This level of focus compounds across your whole year."],
  },
};

// ─── Accent colours per context ───────────────────────────────────────────────
export const ACCENT_MAP = {
  [CTX_DAWN]:      { from: '#f59e0b', to: '#f97316', label: 'Dawn' },
  [CTX_MORNING]:   { from: '#6366f1', to: '#8b5cf6', label: 'Morning' },
  [CTX_NOON]:      { from: '#10b981', to: '#059669', label: 'Midday' },
  [CTX_AFTERNOON]: { from: '#3b82f6', to: '#6366f1', label: 'Afternoon' },
  [CTX_EVENING]:   { from: '#ec4899', to: '#8b5cf6', label: 'Evening' },
  [CTX_NIGHT]:     { from: '#818cf8', to: '#4338ca', label: 'Night' },
};

// ─── Pure helpers (exported for tests) ────────────────────────────────────────
export function getTimeContext(hour) {
  if (hour >= 5  && hour < 8)  return CTX_DAWN;
  if (hour >= 8  && hour < 12) return CTX_MORNING;
  if (hour >= 12 && hour < 14) return CTX_NOON;
  if (hour >= 14 && hour < 18) return CTX_AFTERNOON;
  if (hour >= 18 && hour < 21) return CTX_EVENING;
  return CTX_NIGHT;
}

export function getPomoTier(count) {
  if (count === 0) return 0;
  if (count <= 2)  return 'low';
  if (count <= 5)  return 'mid';
  return 'high';
}

export function pickMessage(hour, pomoCount, seed = 0) {
  const ctx  = getTimeContext(hour);
  const tier = getPomoTier(pomoCount);
  const pool = MESSAGE_BANK[ctx][tier] ?? MESSAGE_BANK[ctx][0];
  return pool[seed % pool.length];
}

const TIER_LABELS = { 0: 'Getting Started', low: 'Building', mid: 'In Flow', high: 'Elite' };
const TYPEWRITER_SPEED_MS = 26;
const AUTO_CYCLE_MS       = 40_000;

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * MotivationalWidget
 *
 * A floating contextual motivational card. Pass `cycleRef` to allow the parent
 * to trigger a message cycle (e.g. from a keyboard shortcut).
 *
 * @param {{ cycleRef?: React.MutableRefObject }} props
 */
export function MotivationalWidget({ cycleRef }) {
  const completedPomos = useSelector(selectCompletedPomos);

  const [visible,  setVisible]  = useState(true);
  const [msgSeed,  setMsgSeed]  = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing,   setTyping]   = useState(false);
  const [exiting,  setExiting]  = useState(false);

  const hour    = new Date().getHours();
  const ctx     = getTimeContext(hour);
  const accent  = ACCENT_MAP[ctx];
  const message = pickMessage(hour, completedPomos, msgSeed);
  const tier    = getPomoTier(completedPomos);

  // ── Typewriter ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    setTyping(true);
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(id);
        setTyping(false);
      }
    }, TYPEWRITER_SPEED_MS);
    return () => clearInterval(id);
  }, [message, visible]);

  // ── Auto-cycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(advanceMessage, AUTO_CYCLE_MS);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgSeed, completedPomos, visible]);

  const advanceMessage = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setMsgSeed(s => s + 1);
      setExiting(false);
    }, 280);
  }, []);

  // ── Expose cycle callback to parent via ref ─────────────────────────────────
  useEffect(() => {
    if (cycleRef) {
      cycleRef.current = () => {
        if (!visible) {
          setVisible(true);
        } else {
          advanceMessage();
        }
      };
    }
  }, [cycleRef, visible, advanceMessage]);

  // ── Reveal badge (shown when widget is dismissed) ───────────────────────────
  if (!visible) {
    return (
      <button
        className={styles.revealBadge}
        style={{ '--w-from': accent.from, '--w-to': accent.to }}
        onClick={() => setVisible(true)}
        aria-label="Show motivational message"
        title="Motivational message (Q)"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 6.5h12M4 10h9M4 13.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    );
  }

  // ── Main widget ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`${styles.widget} ${exiting ? styles.exiting : ''}`}
      style={{ '--w-from': accent.from, '--w-to': accent.to }}
      role="complementary"
      aria-label="Motivational message"
      aria-live="polite"
    >
      {/* Left accent bar */}
      <div className={styles.accentBar} aria-hidden="true" />

      <div className={styles.body}>
        {/* Meta row */}
        <div className={styles.meta}>
          <span className={styles.ctxLabel}>{accent.label}</span>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.tierLabel}>{TIER_LABELS[tier]}</span>
        </div>

        {/* Message text with typewriter cursor */}
        <p className={styles.message}>
          {displayed}
          {typing && <span className={styles.cursor} aria-hidden="true">|</span>}
        </p>

        {/* Action row */}
        <div className={styles.actions}>
          <button
            className={styles.nextBtn}
            onClick={advanceMessage}
            aria-label="Show next motivational message"
            title="Next message (Q)"
          >
            Next
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={styles.dismissBtn}
            onClick={() => setVisible(false)}
            aria-label="Dismiss motivational widget"
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
