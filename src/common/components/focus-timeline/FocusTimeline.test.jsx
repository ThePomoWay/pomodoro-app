import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FocusTimeline, recordFocusSession, TIMELINE_LS_KEY } from './FocusTimeline';

// ─── localStorage mock ────────────────────────────────────────────────────────

let store = {};

beforeEach(() => {
  store = {};
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(k => store[k] ?? null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { store[k] = v; });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(k => { delete store[k]; });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function seedSessions(sessions) {
  store[TIMELINE_LS_KEY] = JSON.stringify({ [todayKey()]: sessions });
}

const noop = () => {};

// ─── recordFocusSession ───────────────────────────────────────────────────────

describe('recordFocusSession', () => {
  it('writes a session entry into localStorage under today\'s key', () => {
    recordFocusSession();
    const data = JSON.parse(store[TIMELINE_LS_KEY]);
    expect(data[todayKey()]).toHaveLength(1);
  });

  it('stores the provided task name', () => {
    recordFocusSession('Write unit tests');
    const data = JSON.parse(store[TIMELINE_LS_KEY]);
    expect(data[todayKey()][0].task).toBe('Write unit tests');
  });

  it('defaults task to empty string when omitted', () => {
    recordFocusSession();
    const data = JSON.parse(store[TIMELINE_LS_KEY]);
    expect(data[todayKey()][0].task).toBe('');
  });

  it('stores a 25-minute duration', () => {
    recordFocusSession();
    const data = JSON.parse(store[TIMELINE_LS_KEY]);
    expect(data[todayKey()][0].duration).toBe(25);
  });

  it('stores a numeric timestamp close to Date.now()', () => {
    const before = Date.now();
    recordFocusSession();
    const after = Date.now();
    const data = JSON.parse(store[TIMELINE_LS_KEY]);
    const { ts } = data[todayKey()][0];
    expect(typeof ts).toBe('number');
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('accumulates multiple calls into the same day array', () => {
    recordFocusSession('A');
    recordFocusSession('B');
    recordFocusSession('C');
    const data = JSON.parse(store[TIMELINE_LS_KEY]);
    expect(data[todayKey()]).toHaveLength(3);
  });

  it('does not throw when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('quota'); });
    expect(() => recordFocusSession()).not.toThrow();
  });

  it('does not throw when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    expect(() => recordFocusSession()).not.toThrow();
  });

  it('appends to an existing set of sessions without overwriting', () => {
    seedSessions([{ ts: Date.now() - 5000, duration: 25, task: 'existing' }]);
    recordFocusSession('new');
    const data = JSON.parse(store[TIMELINE_LS_KEY]);
    const day = data[todayKey()];
    expect(day).toHaveLength(2);
    expect(day[0].task).toBe('existing');
    expect(day[1].task).toBe('new');
  });
});

// ─── FocusTimeline — visibility ───────────────────────────────────────────────

describe('FocusTimeline visibility', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(<FocusTimeline open={false} onClose={noop} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the dialog when open is true', () => {
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});

// ─── FocusTimeline — header & stats ──────────────────────────────────────────

describe('FocusTimeline header and stats strip', () => {
  it('shows the title', () => {
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText('Daily Focus Timeline')).toBeTruthy();
  });

  it('renders all four stat labels', () => {
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText('Sessions')).toBeTruthy();
    expect(screen.getByText('Focus Time')).toBeTruthy();
    expect(screen.getByText('Best Streak')).toBeTruthy();
    expect(screen.getByText('Flow State')).toBeTruthy();
  });

  it('shows session count matching stored sessions', () => {
    seedSessions([
      { ts: Date.now() - 2000, duration: 25, task: '' },
      { ts: Date.now() - 1000, duration: 25, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    // The statValue "2" must exist (session count)
    const statValue = screen.getAllByText('2');
    expect(statValue.length).toBeGreaterThanOrEqual(1);
  });

  it('shows total focus time for two sessions (50m)', () => {
    seedSessions([
      { ts: Date.now() - 2000, duration: 25, task: '' },
      { ts: Date.now() - 1000, duration: 25, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText('50m')).toBeTruthy();
  });

  it('shows 1h for 60 minutes of sessions', () => {
    seedSessions([
      { ts: Date.now() - 3000, duration: 25, task: '' },
      { ts: Date.now() - 2000, duration: 25, task: '' },
      { ts: Date.now() - 1000, duration: 10, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText('1h')).toBeTruthy();
  });
});

// ─── FocusTimeline — empty state ─────────────────────────────────────────────

describe('FocusTimeline empty state', () => {
  it('shows the empty-state message when no sessions exist', () => {
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText(/No sessions yet today/i)).toBeTruthy();
  });

  it('shows the encouragement hint in empty state', () => {
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText(/Complete your first pomodoro/i)).toBeTruthy();
  });
});

// ─── FocusTimeline — session rows ────────────────────────────────────────────

describe('FocusTimeline session rows', () => {
  it('renders a node number for each session', () => {
    seedSessions([
      { ts: Date.now() - 5000, duration: 25, task: '' },
      { ts: Date.now() - 4000, duration: 25, task: '' },
      { ts: Date.now() - 3000, duration: 25, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    // Node numbers 1–3 must appear; use getAllByText to handle possible duplicates
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
  });

  it('shows task name when provided', () => {
    seedSessions([{ ts: Date.now(), duration: 25, task: 'Fix login bug' }]);
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText(/Fix login bug/)).toBeTruthy();
  });

  it('does not show task pin icon when task is empty', () => {
    seedSessions([{ ts: Date.now(), duration: 25, task: '' }]);
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.queryByText(/📌/)).toBeNull();
  });

  it('shows duration in the session card', () => {
    seedSessions([{ ts: Date.now(), duration: 25, task: '' }]);
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText(/25 min/)).toBeTruthy();
  });

  it('shows the "Now" live marker', () => {
    render(<FocusTimeline open={true} onClose={noop} />);
    // The nowLabel span always renders; match on leading "Now"
    expect(screen.getAllByText(/Now/).length).toBeGreaterThanOrEqual(1);
  });
});

// ─── FocusTimeline — flow streak ─────────────────────────────────────────────

describe('FocusTimeline flow streak detection', () => {
  it('shows flow badges when 3+ sessions are within 90 minutes', () => {
    const base = Date.now();
    seedSessions([
      { ts: base,              duration: 25, task: '' },
      { ts: base + 30 * 60_000, duration: 25, task: '' },
      { ts: base + 60 * 60_000, duration: 25, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    const flowBadges = screen.getAllByText(/🔥 Flow/);
    expect(flowBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('does not show flow badge when sessions are >90 minutes apart', () => {
    const base = Date.now();
    seedSessions([
      { ts: base,               duration: 25, task: '' },
      { ts: base + 91 * 60_000,  duration: 25, task: '' },
      { ts: base + 182 * 60_000, duration: 25, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.queryByText(/🔥 Flow/)).toBeNull();
  });

  it('shows fire emoji in stats strip when there is a flow streak', () => {
    const base = Date.now();
    seedSessions([
      { ts: base,              duration: 25, task: '' },
      { ts: base + 30 * 60_000, duration: 25, task: '' },
      { ts: base + 60 * 60_000, duration: 25, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    // The fire emoji in the stats strip
    expect(screen.getAllByText('🔥').length).toBeGreaterThanOrEqual(1);
  });

  it('shows best streak count (3×) in stats strip', () => {
    const base = Date.now();
    seedSessions([
      { ts: base,              duration: 25, task: '' },
      { ts: base + 30 * 60_000, duration: 25, task: '' },
      { ts: base + 60 * 60_000, duration: 25, task: '' },
    ]);
    render(<FocusTimeline open={true} onClose={noop} />);
    expect(screen.getByText('3×')).toBeTruthy();
  });
});

// ─── FocusTimeline — interactions ────────────────────────────────────────────

describe('FocusTimeline interactions', () => {
  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<FocusTimeline open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<FocusTimeline open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when the panel content is clicked', () => {
    const onClose = vi.fn();
    render(<FocusTimeline open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Daily Focus Timeline'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows the keyboard shortcut hint with T key', () => {
    render(<FocusTimeline open={true} onClose={noop} />);
    // The hint paragraph contains kbd elements with T and Esc
    const hint = screen.getByText((_, el) =>
      el?.tagName === 'P' && el?.textContent?.includes('T') && el?.textContent?.includes('Esc')
    );
    expect(hint).toBeTruthy();
  });
});
