import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DistractionCounter,
  DistractionPanel,
  DISTRACTION_LS_KEY,
  saveDistractionSession,
  getDistractionHistory,
} from './DistractionTally';

// ─── localStorage mock ────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (k)    => store[k] ?? null,
    setItem:    (k, v) => { store[k] = String(v); },
    removeItem: (k)    => { delete store[k]; },
    clear:      ()     => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ─── Storage helpers ──────────────────────────────────────────────────────────

describe('saveDistractionSession', () => {
  beforeEach(() => localStorageMock.clear());

  it('stores a session in localStorage', () => {
    saveDistractionSession(1, 3, { phone: 2, thoughts: 1 });
    const raw = localStorageMock.getItem(DISTRACTION_LS_KEY);
    expect(raw).not.toBeNull();
    const data = JSON.parse(raw);
    const sessions = Object.values(data)[0];
    expect(sessions).toHaveLength(1);
    expect(sessions[0].count).toBe(3);
    expect(sessions[0].sessionNum).toBe(1);
    expect(sessions[0].cats.phone).toBe(2);
  });

  it('does nothing when count is 0', () => {
    saveDistractionSession(1, 0, {});
    expect(localStorageMock.getItem(DISTRACTION_LS_KEY)).toBeNull();
  });

  it('appends multiple sessions for the same day', () => {
    saveDistractionSession(1, 2, {});
    saveDistractionSession(2, 4, { other: 4 });
    const data = JSON.parse(localStorageMock.getItem(DISTRACTION_LS_KEY));
    const sessions = Object.values(data)[0];
    expect(sessions).toHaveLength(2);
  });

  it('replaces a session with the same sessionNum', () => {
    saveDistractionSession(1, 2, {});
    saveDistractionSession(1, 5, { colleague: 5 });
    const data = JSON.parse(localStorageMock.getItem(DISTRACTION_LS_KEY));
    const sessions = Object.values(data)[0];
    expect(sessions).toHaveLength(1);
    expect(sessions[0].count).toBe(5);
  });
});

describe('getDistractionHistory', () => {
  beforeEach(() => localStorageMock.clear());

  it('always returns exactly 7 entries', () => {
    const history = getDistractionHistory();
    expect(history).toHaveLength(7);
  });

  it('last entry is today with correct total', () => {
    saveDistractionSession(1, 3, {});
    saveDistractionSession(2, 2, {});
    const history = getDistractionHistory();
    const today = history[history.length - 1];
    expect(today.total).toBe(5);
    expect(today.sessions).toHaveLength(2);
  });

  it('returns zero total for days with no data', () => {
    const history = getDistractionHistory();
    history.forEach((d) => expect(d.total).toBe(0));
  });
});

// ─── DistractionCounter ───────────────────────────────────────────────────────

describe('DistractionCounter', () => {
  beforeEach(() => localStorageMock.clear());

  it('renders the tally button', () => {
    render(<DistractionCounter sessionNum={0} />);
    expect(screen.getByRole('button', { name: /log distraction/i })).toBeInTheDocument();
  });

  it('shows no count badge initially', () => {
    render(<DistractionCounter sessionNum={0} />);
    // count badge only appears when count > 0
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('increments the count on each click', () => {
    render(<DistractionCounter sessionNum={0} />);
    const btn = screen.getByRole('button', { name: /log distraction/i });
    fireEvent.click(btn);
    expect(screen.getByText('1')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.getByText('2')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows category popover after click', () => {
    render(<DistractionCounter sessionNum={0} />);
    fireEvent.click(screen.getByRole('button', { name: /log distraction/i }));
    expect(screen.getByText(/what distracted you/i)).toBeInTheDocument();
  });

  it('shows all 5 category options', () => {
    render(<DistractionCounter sessionNum={0} />);
    fireEvent.click(screen.getByRole('button', { name: /log distraction/i }));
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Thoughts')).toBeInTheDocument();
    expect(screen.getByText('Colleague')).toBeInTheDocument();
    expect(screen.getByText('Notification')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('closes popover when Skip is clicked', () => {
    render(<DistractionCounter sessionNum={0} />);
    fireEvent.click(screen.getByRole('button', { name: /log distraction/i }));
    expect(screen.getByText(/what distracted you/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Skip'));
    expect(screen.queryByText(/what distracted you/i)).not.toBeInTheDocument();
  });

  it('closes popover when a category is selected', () => {
    render(<DistractionCounter sessionNum={0} />);
    fireEvent.click(screen.getByRole('button', { name: /log distraction/i }));
    fireEvent.click(screen.getByText('Phone'));
    expect(screen.queryByText(/what distracted you/i)).not.toBeInTheDocument();
  });

  it('saves and resets when sessionNum increments', () => {
    const { rerender } = render(<DistractionCounter sessionNum={1} />);
    fireEvent.click(screen.getByRole('button', { name: /log distraction/i }));
    fireEvent.click(screen.getByRole('button', { name: /log distraction/i }));
    expect(screen.getByText('2')).toBeInTheDocument();

    rerender(<DistractionCounter sessionNum={2} />);
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(localStorageMock.getItem(DISTRACTION_LS_KEY)).not.toBeNull();
  });

  it('does not save to localStorage when session ends with count=0', () => {
    const { rerender } = render(<DistractionCounter sessionNum={1} />);
    rerender(<DistractionCounter sessionNum={2} />);
    expect(localStorageMock.getItem(DISTRACTION_LS_KEY)).toBeNull();
  });
});

// ─── DistractionPanel ─────────────────────────────────────────────────────────

describe('DistractionPanel', () => {
  beforeEach(() => localStorageMock.clear());

  it('renders nothing when closed', () => {
    render(<DistractionPanel open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByText(/distraction analytics/i)).toBeInTheDocument();
  });

  it('renders 4 stat cards', () => {
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByText('today')).toBeInTheDocument();
    expect(screen.getByText('this week')).toBeInTheDocument();
    expect(screen.getByText(/avg \/ session/i)).toBeInTheDocument();
    expect(screen.getByText(/best session/i)).toBeInTheDocument();
  });

  it('renders 7-day overview section', () => {
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByText(/7-day overview/i)).toBeInTheDocument();
  });

  it('shows empty state when no history', () => {
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByText(/zero distractions logged/i)).toBeInTheDocument();
  });

  it('does not show tip when no data', () => {
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.queryByText('💡')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<DistractionPanel open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<DistractionPanel open={true} onClose={onClose} />);
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not close when panel body is clicked', () => {
    const onClose = vi.fn();
    render(<DistractionPanel open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows today sessions section when data exists', () => {
    saveDistractionSession(1, 3, { phone: 1 });
    saveDistractionSession(2, 1, {});
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByText(/today's sessions/i)).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('shows category breakdown when categorized data exists', () => {
    saveDistractionSession(1, 4, { phone: 2, thoughts: 2 });
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByText(/top distractions/i)).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Thoughts')).toBeInTheDocument();
  });

  it('shows insight tip when sessions exist', () => {
    saveDistractionSession(1, 2, {});
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.getByText('💡')).toBeInTheDocument();
  });

  it('does not show empty state when sessions exist', () => {
    saveDistractionSession(1, 1, {});
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.queryByText(/zero distractions logged/i)).not.toBeInTheDocument();
  });

  it('hides category breakdown when no categories tracked', () => {
    saveDistractionSession(1, 3, {});
    render(<DistractionPanel open={true} onClose={() => {}} />);
    expect(screen.queryByText(/top distractions/i)).not.toBeInTheDocument();
  });

  it('shows correct weekly total in stat card', () => {
    saveDistractionSession(1, 5, {});
    saveDistractionSession(2, 3, {});
    render(<DistractionPanel open={true} onClose={() => {}} />);
    // total this week = 8
    const statVals = document.querySelectorAll('[class*="statVal"]');
    const values = Array.from(statVals).map((el) => el.textContent);
    expect(values).toContain('8');
  });
});
