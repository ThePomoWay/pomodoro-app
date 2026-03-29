import { render, screen, fireEvent } from '@testing-library/react';
import {
  FlowHeatmap,
  recordPomoCompletion,
  readHeatmapData,
  HEATMAP_LS_KEY,
} from './FlowHeatmap';

beforeEach(() => {
  localStorage.clear();
});

// ─── Render / visibility ─────────────────────────────────────────────────────

describe('FlowHeatmap visibility', () => {
  it('renders nothing when open=false', () => {
    render(<FlowHeatmap open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders panel when open=true', () => {
    render(<FlowHeatmap open onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Flow State Heatmap')).toBeTruthy();
    expect(screen.getByText('Your focus intensity — last 7 days')).toBeTruthy();
  });
});

// ─── Interactions ────────────────────────────────────────────────────────────

describe('FlowHeatmap interactions', () => {
  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<FlowHeatmap open onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when panel interior is clicked', () => {
    const onClose = vi.fn();
    render(<FlowHeatmap open onClose={onClose} />);
    fireEvent.click(screen.getByText('Flow State Heatmap'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<FlowHeatmap open onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close heatmap'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<FlowHeatmap open onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose for unrelated keys', () => {
    const onClose = vi.fn();
    render(<FlowHeatmap open onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ─── Stats rendering ─────────────────────────────────────────────────────────

describe('FlowHeatmap stats', () => {
  it('always shows Total Pomodoros stat card', () => {
    render(<FlowHeatmap open onClose={() => {}} />);
    expect(screen.getByText('Total Pomodoros')).toBeTruthy();
  });

  it('shows legend elements', () => {
    render(<FlowHeatmap open onClose={() => {}} />);
    expect(screen.getByText('Less')).toBeTruthy();
    expect(screen.getByText('More')).toBeTruthy();
  });

  it('renders 7 day labels', () => {
    render(<FlowHeatmap open onClose={() => {}} />);
    const dayNames = document.querySelectorAll('[class*="dayName"]');
    expect(dayNames.length).toBe(7);
  });

  it('shows Peak Focus Hour card when data exists', () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    localStorage.setItem(HEATMAP_LS_KEY, JSON.stringify({ [`${y}-${m}-${d}-${h}`]: 3 }));
    render(<FlowHeatmap open onClose={() => {}} />);
    expect(screen.getByText('Peak Focus Hour')).toBeTruthy();
  });
});

// ─── recordPomoCompletion ────────────────────────────────────────────────────

describe('recordPomoCompletion', () => {
  it('writes a record to localStorage', () => {
    recordPomoCompletion();
    const data = readHeatmapData();
    const total = Object.values(data).reduce((s, v) => s + v, 0);
    expect(total).toBe(1);
  });

  it('increments the same key on repeated calls in the same hour', () => {
    recordPomoCompletion();
    recordPomoCompletion();
    recordPomoCompletion();
    const data = readHeatmapData();
    const total = Object.values(data).reduce((s, v) => s + v, 0);
    expect(total).toBe(3);
  });
});

// ─── readHeatmapData ─────────────────────────────────────────────────────────

describe('readHeatmapData', () => {
  it('returns an empty object when nothing is stored', () => {
    expect(readHeatmapData()).toEqual({});
  });

  it('returns stored data', () => {
    const fixture = { '2026-03-29-09': 2, '2026-03-29-14': 1 };
    localStorage.setItem(HEATMAP_LS_KEY, JSON.stringify(fixture));
    expect(readHeatmapData()).toEqual(fixture);
  });

  it('returns empty object on corrupt JSON', () => {
    localStorage.setItem(HEATMAP_LS_KEY, 'not-json{{{');
    expect(readHeatmapData()).toEqual({});
  });
});
