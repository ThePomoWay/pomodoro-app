import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SmartSortPanel } from './SmartSortPanel';
import { tasksSlice } from '../../state/slice/TasksSlice';

// ─── Store factory ────────────────────────────────────────────────────────────
const BASE_TASK_STATE = {
  tasks: {},
  todaysTasks: [],
  todaysCompletedTasks: [],
  allTasks: [],
  currentTaskRef: '',
  editTaskRef: '',
  allCompletedTasks: { from: '', to: '', tasks: [] },
};

function makeStore(taskState = {}) {
  return configureStore({
    reducer: { tasks: tasksSlice.reducer },
    preloadedState: { tasks: { ...BASE_TASK_STATE, ...taskState } },
  });
}

const T1 = { fid: 't1', title: 'Write quarterly report', priority: 1, estimatedPomodoros: 4, csec: 0 };
const T2 = { fid: 't2', title: 'Check emails',          priority: 3, estimatedPomodoros: 1, csec: 0 };
const T3 = { fid: 't3', title: 'Code review',           priority: 2, estimatedPomodoros: 2, csec: 120 };

function renderPanel(open = true, taskState = {}) {
  const store = makeStore(taskState);
  const onClose = vi.fn();
  const utils = render(
    <Provider store={store}>
      <SmartSortPanel open={open} onClose={onClose} />
    </Provider>
  );
  return { store, onClose, ...utils };
}

// ─── Visibility ────────────────────────────────────────────────────────────────
describe('SmartSortPanel visibility', () => {
  it('renders nothing when open=false', () => {
    renderPanel(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the dialog when open=true', () => {
    renderPanel(true);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('shows "Smart Sort" heading', () => {
    renderPanel(true);
    expect(screen.getByText('Smart Sort')).toBeTruthy();
  });

  it('calls onClose when backdrop is clicked', () => {
    const { onClose } = renderPanel(true);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when panel content is clicked', () => {
    const { onClose } = renderPanel(true);
    const heading = screen.getByText('Smart Sort');
    fireEvent.click(heading);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const { onClose } = renderPanel(true);
    fireEvent.click(screen.getByLabelText('Close Smart Sort'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ─── Empty state ──────────────────────────────────────────────────────────────
describe('SmartSortPanel empty state', () => {
  it('shows empty-state copy when there are no tasks', () => {
    renderPanel(true);
    expect(screen.getByText('No tasks for today')).toBeTruthy();
  });

  it('does not render the task list when empty', () => {
    renderPanel(true);
    expect(screen.queryByRole('list', { name: 'Suggested task order' })).toBeNull();
  });
});

// ─── Task list rendering ──────────────────────────────────────────────────────
describe('SmartSortPanel task list', () => {
  const taskState = {
    tasks: { t1: T1, t2: T2, t3: T3 },
    todaysTasks: ['t1', 't2', 't3'],
  };

  it('renders the suggested order list when tasks exist', () => {
    renderPanel(true, taskState);
    expect(screen.getByRole('list', { name: 'Suggested task order' })).toBeTruthy();
  });

  it('renders all 3 task titles', () => {
    renderPanel(true, taskState);
    expect(screen.getByText('Write quarterly report')).toBeTruthy();
    expect(screen.getByText('Check emails')).toBeTruthy();
    expect(screen.getByText('Code review')).toBeTruthy();
  });

  it('surfaces the in-progress badge for a task with csec > 0', () => {
    renderPanel(true, taskState);
    expect(screen.getByText('⚡ In progress')).toBeTruthy();
  });

  it('surfaces a high-priority badge for priority=1 tasks', () => {
    renderPanel(true, taskState);
    // Could be "Priority + peak energy" or "High priority" depending on time of day
    const badge = screen.getAllByText(/priority/i);
    expect(badge.length).toBeGreaterThan(0);
  });

  it('shows pomo estimate pill for tasks with estimatedPomodoros > 0', () => {
    renderPanel(true, taskState);
    expect(screen.getByText('🍅 4')).toBeTruthy();
    expect(screen.getByText('🍅 1')).toBeTruthy();
    expect(screen.getByText('🍅 2')).toBeTruthy();
  });
});

// ─── Energy section ───────────────────────────────────────────────────────────
describe('SmartSortPanel energy section', () => {
  it('renders the cognitive energy label', () => {
    renderPanel(true);
    expect(screen.getByText('Cognitive energy')).toBeTruthy();
  });

  it('renders a percentage value for energy level', () => {
    renderPanel(true);
    expect(screen.getByText(/%$/)).toBeTruthy();
  });

  it('renders the phase chip', () => {
    renderPanel(true);
    // Phase chip shows one of the phase labels
    const phases = ['Dawn', 'Morning', 'Midday', 'Afternoon', 'Evening', 'Night'];
    const found = phases.some(p => screen.queryByText(p) !== null);
    expect(found).toBe(true);
  });
});

// ─── Sorting logic ────────────────────────────────────────────────────────────
describe('SmartSortPanel sorting priority', () => {
  it('places the in-progress task (csec > 0) at the top', () => {
    // T3 has csec=120 (in-progress), so it should rank first
    const taskState = {
      tasks: { t1: T1, t2: T2, t3: T3 },
      todaysTasks: ['t1', 't2', 't3'],
    };
    renderPanel(true, taskState);
    const items = screen.getAllByRole('listitem');
    // First listitem should contain "Code review"
    expect(items[0].textContent).toContain('Code review');
  });

  it('places priority=1 task ahead of priority=3 (no in-progress)', () => {
    const taskState = {
      tasks: { t1: T1, t2: T2 },
      todaysTasks: ['t2', 't1'], // reversed order in store
    };
    renderPanel(true, taskState);
    const items = screen.getAllByRole('listitem');
    // T1 (priority=1) should be first
    expect(items[0].textContent).toContain('Write quarterly report');
  });
});

// ─── Apply sort ───────────────────────────────────────────────────────────────
describe('SmartSortPanel apply action', () => {
  it('shows "Apply Smart Sort" button when order differs from suggestion', () => {
    // Put high-priority task last in store order to guarantee it's out of order
    const taskState = {
      tasks: { t1: T1, t2: T2 },
      todaysTasks: ['t2', 't1'],
    };
    renderPanel(true, taskState);
    expect(screen.getByText('Apply Smart Sort')).toBeTruthy();
  });

  it('shows "Already optimal" indicator when already in correct order', () => {
    // Only one task — always optimal
    const taskState = {
      tasks: { t1: T1 },
      todaysTasks: ['t1'],
    };
    renderPanel(true, taskState);
    expect(screen.getByText('✓ Already optimal')).toBeTruthy();
  });

  it('dispatches updateTodaysTasks on Apply click and shows success message', () => {
    vi.useFakeTimers();
    const taskState = {
      tasks: { t1: T1, t2: T2 },
      todaysTasks: ['t2', 't1'],
    };
    const { store } = renderPanel(true, taskState);
    fireEvent.click(screen.getByText('Apply Smart Sort'));
    expect(screen.getByText('✓ Tasks reordered!')).toBeTruthy();
    // Verify Redux state was updated
    const newIds = store.getState().tasks.todaysTasks;
    // T1 (priority=1) should now be first
    expect(newIds[0]).toBe('t1');
    vi.useRealTimers();
  });

  it('shows "Keep current order" (no apply) when already optimal', () => {
    const taskState = {
      tasks: { t1: T1 },
      todaysTasks: ['t1'],
    };
    renderPanel(true, taskState);
    expect(screen.getByText('Keep current order')).toBeTruthy();
    expect(screen.queryByText('Apply Smart Sort')).toBeNull();
  });
});
