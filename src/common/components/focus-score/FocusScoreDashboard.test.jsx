import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FocusScoreDashboard, computeScores, DAILY_POMO_GOAL } from './FocusScoreDashboard';

// ─── Minimal Redux store ───────────────────────────────────────────────────────

function makeStore({ todaysTasks = [], todaysCompletedTasks = [] } = {}) {
  return configureStore({
    reducer: {
      tasks: () => ({
        todaysTasks: todaysTasks.map((t) => t.id),
        todaysCompletedTasks: todaysCompletedTasks.map((t) => t.id),
        tasks: Object.fromEntries(
          [...todaysTasks, ...todaysCompletedTasks].map((t) => [t.id, t]),
        ),
      }),
    },
  });
}

function renderDashboard(props, storeOpts = {}) {
  const store = makeStore(storeOpts);
  return render(
    <Provider store={store}>
      <FocusScoreDashboard {...props} />
    </Provider>,
  );
}

// ─── Mock localStorage via readHeatmapData ─────────────────────────────────
vi.mock('../flow-heatmap/FlowHeatmap', () => ({
  readHeatmapData: vi.fn(() => ({})),
}));

import { readHeatmapData } from '../flow-heatmap/FlowHeatmap';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FocusScoreDashboard', () => {
  beforeEach(() => {
    readHeatmapData.mockReturnValue({});
  });

  it('renders nothing when closed', () => {
    const { container } = renderDashboard({ open: false, onClose: vi.fn() });
    expect(container.firstChild).toBeNull();
  });

  it('renders the panel when open', () => {
    renderDashboard({ open: true, onClose: vi.fn() });
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Focus Score')).toBeTruthy();
  });

  it('shows the subtitle', () => {
    renderDashboard({ open: true, onClose: vi.fn() });
    expect(screen.getByText("Today's productivity at a glance")).toBeTruthy();
  });

  it('shows all four breakdown bar labels', () => {
    renderDashboard({ open: true, onClose: vi.fn() });
    expect(screen.getByText('Pomodoros')).toBeTruthy();
    expect(screen.getByText('Tasks')).toBeTruthy();
    expect(screen.getByText('Streak')).toBeTruthy();
    expect(screen.getByText('Momentum')).toBeTruthy();
  });

  it('renders progress bars with correct ARIA attributes', () => {
    renderDashboard({ open: true, onClose: vi.fn() });
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(4);
    bars.forEach((bar) => {
      expect(bar.getAttribute('aria-valuemin')).toBe('0');
      expect(bar.getAttribute('aria-valuemax')).toBe('100');
    });
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    renderDashboard({ open: true, onClose });
    fireEvent.click(screen.getByLabelText('Close focus score'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    renderDashboard({ open: true, onClose });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    renderDashboard({ open: true, onClose });
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows trend badge when yesterday had pomos', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.getFullYear();
    const m = String(yesterday.getMonth() + 1).padStart(2, '0');
    const d = String(yesterday.getDate()).padStart(2, '0');
    readHeatmapData.mockReturnValue({ [`${y}-${m}-${d}-10`]: 3 });

    renderDashboard({ open: true, onClose: vi.fn() });
    expect(screen.getByText(/vs yesterday/i)).toBeTruthy();
  });

  it('does not show trend badge with no historical data', () => {
    readHeatmapData.mockReturnValue({});
    renderDashboard({ open: true, onClose: vi.fn() });
    expect(screen.queryByText(/vs yesterday/i)).toBeNull();
  });

  it('shows footer note with daily goal', () => {
    renderDashboard({ open: true, onClose: vi.fn() });
    expect(
      screen.getByText(new RegExp(`${DAILY_POMO_GOAL} pomodoros / day`)),
    ).toBeTruthy();
  });
});

// ─── computeScores unit tests ─────────────────────────────────────────────────

describe('computeScores', () => {
  it('returns overall 0 when no data and no tasks', () => {
    const result = computeScores({}, [], []);
    expect(result.overall).toBe(0);
    expect(result.pomosToday).toBe(0);
    expect(result.streak).toBe(0);
    expect(result.trend).toBeNull();
  });

  it('caps pomoScore at 100', () => {
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-10`;
    const data = { [key]: 20 }; // 20 pomos >> DAILY_POMO_GOAL
    const result = computeScores(data, [], []);
    expect(result.pomoScore).toBe(100);
  });

  it('computes task score correctly', () => {
    const tasks     = [{ id: 'a' }, { id: 'b' }];
    const completed = [{ id: 'c' }];
    const result    = computeScores({}, tasks, completed);
    // completedCount / totalCount = 1 / 3 ≈ 33%
    expect(result.taskScore).toBe(33);
  });

  it('returns positive trend when today > yesterday', () => {
    const now  = new Date();
    const prev = new Date(now);
    prev.setDate(prev.getDate() - 1);
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-10`;
    const prevKey  = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}-10`;
    const data     = { [todayKey]: 5, [prevKey]: 3 };
    const result   = computeScores(data, [], []);
    expect(result.trend).toBe(2);
  });
});
