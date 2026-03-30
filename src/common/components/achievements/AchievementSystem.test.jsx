import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  ACHIEVEMENT_DEFS,
  ACHIEVEMENTS_LS_KEY,
  readAchievements,
  evaluateAchievements,
  checkAndUnlockAchievements,
  AchievementSystem,
  AchievementToast,
} from './AchievementSystem';
import { HEATMAP_LS_KEY } from '../flow-heatmap/FlowHeatmap';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function key(daysAgo, hour) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dy}-${String(hour).padStart(2, '0')}`;
}

function setHeatmap(data) {
  localStorage.setItem(HEATMAP_LS_KEY, JSON.stringify(data));
}

function setStoredAchievements(data) {
  localStorage.setItem(ACHIEVEMENTS_LS_KEY, JSON.stringify(data));
}

// ─── evaluateAchievements ─────────────────────────────────────────────────────

describe('evaluateAchievements', () => {
  it('returns empty set for empty data', () => {
    expect(evaluateAchievements({})).toEqual(new Set());
  });

  it('unlocks first-flame for 1 pomo', () => {
    const data = { [key(0, 10)]: 1 };
    expect(evaluateAchievements(data).has('first-flame')).toBe(true);
  });

  it('unlocks getting-started at 5 total', () => {
    const data = { [key(0, 10)]: 3, [key(1, 11)]: 2 };
    const u = evaluateAchievements(data);
    expect(u.has('getting-started')).toBe(true);
  });

  it('does NOT unlock getting-started at 4 total', () => {
    const data = { [key(0, 10)]: 4 };
    expect(evaluateAchievements(data).has('getting-started')).toBe(false);
  });

  it('unlocks focus-block when 4 pomos in one day', () => {
    const data = { [key(0, 9)]: 2, [key(0, 14)]: 2 };
    expect(evaluateAchievements(data).has('focus-block')).toBe(true);
  });

  it('does NOT unlock focus-block for 3 pomos in one day', () => {
    const data = { [key(0, 9)]: 3 };
    expect(evaluateAchievements(data).has('focus-block')).toBe(false);
  });

  it('unlocks power-day when 8 pomos in one day', () => {
    const data = { [key(0, 9)]: 4, [key(0, 15)]: 4 };
    expect(evaluateAchievements(data).has('power-day')).toBe(true);
  });

  it('unlocks dedicated at 25 total', () => {
    const data = { [key(0, 10)]: 25 };
    expect(evaluateAchievements(data).has('dedicated')).toBe(true);
  });

  it('unlocks half-century at 50 total', () => {
    const data = { [key(0, 10)]: 50 };
    const u = evaluateAchievements(data);
    expect(u.has('half-century')).toBe(true);
  });

  it('unlocks centurion at 100 total', () => {
    const data = { [key(0, 10)]: 100 };
    expect(evaluateAchievements(data).has('centurion')).toBe(true);
  });

  it('unlocks night-owl for pomo at hour 22', () => {
    const data = { [key(0, 22)]: 1 };
    expect(evaluateAchievements(data).has('night-owl')).toBe(true);
  });

  it('unlocks night-owl for pomo at hour 23', () => {
    const data = { [key(0, 23)]: 1 };
    expect(evaluateAchievements(data).has('night-owl')).toBe(true);
  });

  it('does NOT unlock night-owl for pomo at hour 21', () => {
    const data = { [key(0, 21)]: 1 };
    expect(evaluateAchievements(data).has('night-owl')).toBe(false);
  });

  it('unlocks early-bird for pomo at hour 6', () => {
    const data = { [key(0, 6)]: 1 };
    expect(evaluateAchievements(data).has('early-bird')).toBe(true);
  });

  it('does NOT unlock early-bird for pomo at hour 7', () => {
    const data = { [key(0, 7)]: 1 };
    expect(evaluateAchievements(data).has('early-bird')).toBe(false);
  });

  it('unlocks three-day-habit for 3 consecutive days', () => {
    const data = {
      [key(2, 10)]: 1,
      [key(1, 10)]: 1,
      [key(0, 10)]: 1,
    };
    expect(evaluateAchievements(data).has('three-day-habit')).toBe(true);
  });

  it('does NOT unlock three-day-habit with a gap', () => {
    const data = {
      [key(3, 10)]: 1,
      [key(1, 10)]: 1,
      [key(0, 10)]: 1,
    };
    expect(evaluateAchievements(data).has('three-day-habit')).toBe(false);
  });

  it('ignores keys with fewer than 4 parts', () => {
    const data = { 'bad-key': 1 };
    expect(() => evaluateAchievements(data)).not.toThrow();
  });
});

// ─── readAchievements ─────────────────────────────────────────────────────────

describe('readAchievements', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty object when nothing stored', () => {
    expect(readAchievements()).toEqual({});
  });

  it('returns stored achievements', () => {
    setStoredAchievements({ 'first-flame': { unlocked: true } });
    expect(readAchievements()['first-flame'].unlocked).toBe(true);
  });

  it('returns empty object on parse error', () => {
    localStorage.setItem(ACHIEVEMENTS_LS_KEY, 'not-json');
    expect(readAchievements()).toEqual({});
  });
});

// ─── checkAndUnlockAchievements ───────────────────────────────────────────────

describe('checkAndUnlockAchievements', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty array when no heatmap data', () => {
    expect(checkAndUnlockAchievements()).toEqual([]);
  });

  it('returns newly unlocked defs when conditions met', () => {
    setHeatmap({ [key(0, 10)]: 1 });
    const newly = checkAndUnlockAchievements();
    expect(newly.some((d) => d.id === 'first-flame')).toBe(true);
  });

  it('does not return already-stored achievements', () => {
    setHeatmap({ [key(0, 10)]: 1 });
    setStoredAchievements({ 'first-flame': { unlocked: true, unlockedAt: new Date().toISOString() } });
    const newly = checkAndUnlockAchievements();
    expect(newly.some((d) => d.id === 'first-flame')).toBe(false);
  });

  it('persists newly unlocked achievements to localStorage', () => {
    setHeatmap({ [key(0, 10)]: 1 });
    checkAndUnlockAchievements();
    const stored = readAchievements();
    expect(stored['first-flame']?.unlocked).toBe(true);
    expect(stored['first-flame']?.unlockedAt).toBeDefined();
  });
});

// ─── AchievementSystem (Trophy Case Modal) ────────────────────────────────────

describe('AchievementSystem', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  const onClose = vi.fn();

  it('renders nothing when closed', () => {
    render(<AchievementSystem open={false} onClose={onClose} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the panel when open', () => {
    render(<AchievementSystem open={true} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Trophy Case')).toBeTruthy();
  });

  it('shows correct unlocked count in subtitle', () => {
    setStoredAchievements({ 'first-flame': { unlocked: true } });
    render(<AchievementSystem open={true} onClose={onClose} />);
    expect(screen.getByText(/1 \/ 10 achievements unlocked/)).toBeTruthy();
  });

  it('shows 0 unlocked when storage empty', () => {
    render(<AchievementSystem open={true} onClose={onClose} />);
    expect(screen.getByText(/0 \/ 10 achievements unlocked/)).toBeTruthy();
  });

  it('calls onClose when backdrop is clicked', () => {
    const close = vi.fn();
    render(<AchievementSystem open={true} onClose={close} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(close).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const close = vi.fn();
    render(<AchievementSystem open={true} onClose={close} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(close).toHaveBeenCalled();
  });

  it('does NOT call onClose when inner panel is clicked', () => {
    const close = vi.fn();
    render(<AchievementSystem open={true} onClose={close} />);
    fireEvent.click(screen.getByRole('progressbar'));
    expect(close).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const close = vi.fn();
    render(<AchievementSystem open={true} onClose={close} />);
    fireEvent.click(screen.getByLabelText('Close achievements'));
    expect(close).toHaveBeenCalled();
  });

  it('renders a badge for each achievement def', () => {
    render(<AchievementSystem open={true} onClose={onClose} />);
    expect(screen.getAllByText('First Flame')).toBeTruthy();
    expect(screen.getAllByText('Centurion')).toBeTruthy();
  });

  it('has progressbar with correct aria-valuenow', () => {
    setStoredAchievements({ 'first-flame': { unlocked: true } });
    render(<AchievementSystem open={true} onClose={onClose} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('10'); // 1/10 = 10%
  });

  it('renders locked icon for locked badges', () => {
    render(<AchievementSystem open={true} onClose={onClose} />);
    // All badges locked → all show 🔒
    const locks = screen.getAllByText('🔒');
    expect(locks.length).toBe(ACHIEVEMENT_DEFS.length);
  });

  it('renders actual icon (not 🔒) for unlocked badges', () => {
    setStoredAchievements({ 'first-flame': { unlocked: true } });
    render(<AchievementSystem open={true} onClose={onClose} />);
    // 🔥 should appear for the unlocked badge
    expect(screen.getByText('🔥')).toBeTruthy();
  });
});

// ─── AchievementToast ─────────────────────────────────────────────────────────

describe('AchievementToast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders nothing for empty achievements array', () => {
    const { container } = render(
      <AchievementToast achievements={[]} onViewAll={vi.fn()} onDismiss={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the achievement name when provided', () => {
    render(
      <AchievementToast
        achievements={[ACHIEVEMENT_DEFS[0]]}
        onViewAll={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );
    expect(screen.getByText(ACHIEVEMENT_DEFS[0].name)).toBeTruthy();
    expect(screen.getByText('Achievement Unlocked!')).toBeTruthy();
  });

  it('calls onViewAll when View button clicked', () => {
    const onViewAll = vi.fn();
    render(
      <AchievementToast
        achievements={[ACHIEVEMENT_DEFS[0]]}
        onViewAll={onViewAll}
        onDismiss={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByLabelText('View all achievements'));
    expect(onViewAll).toHaveBeenCalled();
  });

  it('calls onDismiss after timeout', () => {
    const onDismiss = vi.fn();
    render(
      <AchievementToast
        achievements={[ACHIEVEMENT_DEFS[0]]}
        onViewAll={vi.fn()}
        onDismiss={onDismiss}
      />,
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('has accessible status role', () => {
    render(
      <AchievementToast
        achievements={[ACHIEVEMENT_DEFS[0]]}
        onViewAll={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
