import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  MotivationalWidget,
  getTimeContext,
  getPomoTier,
  pickMessage,
  MESSAGE_BANK,
  ACCENT_MAP,
  CTX_DAWN,
  CTX_MORNING,
  CTX_NOON,
  CTX_AFTERNOON,
  CTX_EVENING,
  CTX_NIGHT,
} from './MotivationalWidget';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeStore(completedPomos = 0) {
  return configureStore({
    reducer: {
      timer: () => ({ completedPomos }),
    },
  });
}

function renderWidget(completedPomos = 0, props = {}) {
  const store = makeStore(completedPomos);
  return render(
    <Provider store={store}>
      <MotivationalWidget {...props} />
    </Provider>,
  );
}

// ─── getTimeContext ───────────────────────────────────────────────────────────
describe('getTimeContext', () => {
  it('returns dawn for hours 5-7', () => {
    expect(getTimeContext(5)).toBe(CTX_DAWN);
    expect(getTimeContext(6)).toBe(CTX_DAWN);
    expect(getTimeContext(7)).toBe(CTX_DAWN);
  });

  it('returns morning for hours 8-11', () => {
    expect(getTimeContext(8)).toBe(CTX_MORNING);
    expect(getTimeContext(11)).toBe(CTX_MORNING);
  });

  it('returns noon for hours 12-13', () => {
    expect(getTimeContext(12)).toBe(CTX_NOON);
    expect(getTimeContext(13)).toBe(CTX_NOON);
  });

  it('returns afternoon for hours 14-17', () => {
    expect(getTimeContext(14)).toBe(CTX_AFTERNOON);
    expect(getTimeContext(17)).toBe(CTX_AFTERNOON);
  });

  it('returns evening for hours 18-20', () => {
    expect(getTimeContext(18)).toBe(CTX_EVENING);
    expect(getTimeContext(20)).toBe(CTX_EVENING);
  });

  it('returns night for hours 21-4', () => {
    expect(getTimeContext(21)).toBe(CTX_NIGHT);
    expect(getTimeContext(0)).toBe(CTX_NIGHT);
    expect(getTimeContext(4)).toBe(CTX_NIGHT);
  });
});

// ─── getPomoTier ─────────────────────────────────────────────────────────────
describe('getPomoTier', () => {
  it('returns 0 for no pomodoros', () => {
    expect(getPomoTier(0)).toBe(0);
  });

  it('returns low for 1-2 pomodoros', () => {
    expect(getPomoTier(1)).toBe('low');
    expect(getPomoTier(2)).toBe('low');
  });

  it('returns mid for 3-5 pomodoros', () => {
    expect(getPomoTier(3)).toBe('mid');
    expect(getPomoTier(5)).toBe('mid');
  });

  it('returns high for 6+ pomodoros', () => {
    expect(getPomoTier(6)).toBe('high');
    expect(getPomoTier(12)).toBe('high');
  });
});

// ─── pickMessage ─────────────────────────────────────────────────────────────
describe('pickMessage', () => {
  it('returns a non-empty string for every hour/pomo combination', () => {
    const pomoValues = [0, 1, 3, 6];
    for (let hour = 0; hour < 24; hour++) {
      for (const pomos of pomoValues) {
        const msg = pickMessage(hour, pomos, 0);
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
      }
    }
  });

  it('cycles through messages with different seeds', () => {
    const msg0 = pickMessage(10, 0, 0);
    const msg1 = pickMessage(10, 0, 1);
    expect(typeof msg0).toBe('string');
    expect(typeof msg1).toBe('string');
    expect(msg0).not.toBe(msg1);
  });

  it('wraps seed around pool length', () => {
    const pool = MESSAGE_BANK[CTX_MORNING][0];
    const msg = pickMessage(10, 0, pool.length);
    expect(msg).toBe(pool[0]);
  });
});

// ─── MESSAGE_BANK completeness ────────────────────────────────────────────────
describe('MESSAGE_BANK', () => {
  const contexts = [CTX_DAWN, CTX_MORNING, CTX_NOON, CTX_AFTERNOON, CTX_EVENING, CTX_NIGHT];
  const tiers    = [0, 'low', 'mid', 'high'];

  contexts.forEach(ctx => {
    tiers.forEach(tier => {
      it(`has ≥ 3 messages for ${ctx}/${tier}`, () => {
        expect(MESSAGE_BANK[ctx][tier].length).toBeGreaterThanOrEqual(3);
      });
    });
  });
});

// ─── ACCENT_MAP ───────────────────────────────────────────────────────────────
describe('ACCENT_MAP', () => {
  const contexts = [CTX_DAWN, CTX_MORNING, CTX_NOON, CTX_AFTERNOON, CTX_EVENING, CTX_NIGHT];

  contexts.forEach(ctx => {
    it(`has from, to, and label for ${ctx}`, () => {
      expect(ACCENT_MAP[ctx].from).toMatch(/^#/);
      expect(ACCENT_MAP[ctx].to).toMatch(/^#/);
      expect(ACCENT_MAP[ctx].label.length).toBeGreaterThan(0);
    });
  });
});

// ─── Component rendering ──────────────────────────────────────────────────────
describe('MotivationalWidget rendering', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the widget with aria role', () => {
    renderWidget(0);
    expect(screen.getByRole('complementary')).toBeTruthy();
  });

  it('shows one of the known time-context labels', () => {
    renderWidget(0);
    const labels = ['Dawn', 'Morning', 'Midday', 'Afternoon', 'Evening', 'Night'];
    const found = labels.some(l => screen.queryByText(l));
    expect(found).toBe(true);
  });

  it('renders Next button', () => {
    renderWidget(0);
    expect(screen.getByTitle(/next message/i)).toBeTruthy();
  });

  it('renders dismiss button', () => {
    renderWidget(0);
    expect(screen.getByLabelText(/dismiss motivational/i)).toBeTruthy();
  });

  it('switches to reveal badge on dismiss click', () => {
    renderWidget(0);
    fireEvent.click(screen.getByLabelText(/dismiss motivational/i));
    expect(screen.getByLabelText(/show motivational message/i)).toBeTruthy();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('re-shows widget when reveal badge is clicked', () => {
    renderWidget(0);
    fireEvent.click(screen.getByLabelText(/dismiss motivational/i));
    fireEvent.click(screen.getByLabelText(/show motivational message/i));
    expect(screen.getByRole('complementary')).toBeTruthy();
  });

  it('exposes cycleRef callback', () => {
    const cycleRef = { current: null };
    renderWidget(0, { cycleRef });
    expect(typeof cycleRef.current).toBe('function');
  });

  it('cycleRef re-shows widget when called while hidden', () => {
    const cycleRef = { current: null };
    renderWidget(0, { cycleRef });
    fireEvent.click(screen.getByLabelText(/dismiss motivational/i));
    expect(screen.queryByRole('complementary')).toBeNull();
    act(() => { cycleRef.current(); });
    expect(screen.getByRole('complementary')).toBeTruthy();
  });

  it('shows "Getting Started" tier label with 0 pomos', () => {
    renderWidget(0);
    expect(screen.getByText('Getting Started')).toBeTruthy();
  });

  it('shows "Building" tier label with 1 pomo', () => {
    renderWidget(1);
    expect(screen.getByText('Building')).toBeTruthy();
  });

  it('shows "In Flow" tier label with 4 pomos', () => {
    renderWidget(4);
    expect(screen.getByText('In Flow')).toBeTruthy();
  });

  it('shows "Elite" tier label with 8 pomos', () => {
    renderWidget(8);
    expect(screen.getByText('Elite')).toBeTruthy();
  });
});
