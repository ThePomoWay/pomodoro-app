// SessionCompleteModal — fires after every 4 completed pomodoros.
// Pure-canvas confetti, animated stats card, motivational headline.
// All colours via CSS variables — no hardcoded white/black.

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectTodaysCompletedTasks,
  selectDefaultTimes,
} from "../../state/selectors";
import styles from "./SessionCompleteModal.module.scss";

// ─── Helpers ────────────────────────────────────────────────────────────────

const MESSAGES = [
  {
    headline: "Session Complete!",
    sub: "You just crushed 4 focused pomodoros. That's real momentum.",
  },
  {
    headline: "On Fire!",
    sub: "8 pomodoros deep — your focus muscle is growing stronger.",
  },
  {
    headline: "Flow Master!",
    sub: "A dozen pomodoros done. You're in elite focus territory today.",
  },
];

function getMessage(completedPomos) {
  const sets = Math.floor(completedPomos / 4);
  return MESSAGES[Math.min(sets - 1, MESSAGES.length - 1)] || MESSAGES[0];
}

function formatFocusTime(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Confetti Canvas ─────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#7c6fcd",
  "#38bec9",
  "#f6c90e",
  "#e84393",
  "#69db7c",
  "#ff6b6b",
  "#a78bfa",
];

function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = (canvas.width = canvas.offsetWidth || window.innerWidth);
    const H = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const pieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * -1 - 20,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.18,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 2.2 + Math.random() * 3.5,
      opacity: 0.75 + Math.random() * 0.25,
    }));

    let raf;
    let active = true;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
        }
      });
      if (active) raf = requestAnimationFrame(draw);
    }

    draw();
    const stopTimer = setTimeout(() => {
      active = false;
    }, 5000);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.confetti} aria-hidden="true" />
  );
}

// ─── Animated Stat Counter ───────────────────────────────────────────────────

function AnimatedCount({ target, suffix = "" }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <span>
      {displayed}
      {suffix}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function SessionCompleteModal({ open, onClose, completedPomos }) {
  const completedTasks = useSelector(selectTodaysCompletedTasks);
  const { defaultWorkTime } = useSelector(selectDefaultTimes);

  const focusMinutes = Math.round(
    (completedPomos * (defaultWorkTime || 1500)) / 60
  );
  const msg = getMessage(completedPomos);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`${styles.backdrop} ${visible ? styles.backdropVisible : ""}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Session complete"
    >
      <ConfettiCanvas />

      <div
        className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.trophy} aria-hidden="true">
          🏆
        </div>

        <h2 className={styles.headline}>{msg.headline}</h2>
        <p className={styles.sub}>{msg.sub}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue} aria-label={`${completedPomos} pomodoros`}>
              {visible ? <AnimatedCount target={completedPomos} /> : 0}
            </span>
            <span className={styles.statLabel}>Pomodoros</span>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.stat}>
            <span className={styles.statValue} aria-label={`${completedTasks.length} tasks done`}>
              {visible ? (
                <AnimatedCount target={completedTasks.length} />
              ) : (
                0
              )}
            </span>
            <span className={styles.statLabel}>Tasks done</span>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.stat}>
            <span className={styles.statValue} aria-label={`${formatFocusTime(focusMinutes)} focus time`}>
              {formatFocusTime(focusMinutes)}
            </span>
            <span className={styles.statLabel}>Focus time</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={onClose}
            aria-label="Keep going"
          >
            Keep going
          </button>
          <button
            className={styles.btnSecondary}
            onClick={onClose}
            aria-label="Take a break"
          >
            Take a break
          </button>
        </div>

        <p className={styles.hint}>Next milestone: {completedPomos + 4} pomodoros</p>
      </div>
    </div>
  );
}
