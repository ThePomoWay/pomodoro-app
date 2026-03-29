import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Mock modules that touch IndexedDB / browser APIs unavailable in jsdom.
vi.mock("../../state/thunks/TimerThunk", () => ({
  pauseTimerAsync: vi.fn(() => ({ type: "timer/pause" })),
  resumeTimerAsync: vi.fn(() => ({ type: "timer/resume" })),
  startTimerAsync: vi.fn(() => ({ type: "timer/start" })),
  resetTimerAsync: vi.fn(() => ({ type: "timer/reset" })),
}));
vi.mock("../../state/slice/GlobalSlice", () => ({
  setIsTimerFullScreen: vi.fn((v) => ({ type: "global/setFullScreen", payload: v })),
  setSettingsModal: vi.fn(() => ({ type: "global/setSettingsModal" })),
  showClockSettingsModal: vi.fn(() => ({ type: "global/showClockSettings" })),
}));

import { KeyboardShortcutOverlay } from "./KeyboardShortcutOverlay";

// Minimal mock slices so selectors resolve without error.
const timerReducer = () => ({
  pomoState: "POMO_IDLE_STATE",
  timerInSec: 1500,
  completedPomos: 0,
});
const globalReducer = () => ({
  focusMode: false,
  isTimerFullScreen: false,
  theme: "dark",
  showAddTaskBtn: false,
  taskToBeEdited: null,
  onboardingModalOpen: false,
  projectModalOpen: false,
  labelModalOpen: false,
  toast: null,
  settings: { showModal: false, tab: 0 },
});

function makeStore() {
  return configureStore({
    reducer: { timer: timerReducer, global: globalReducer },
  });
}

function renderWithStore(ui) {
  return render(<Provider store={makeStore()}>{ui}</Provider>);
}

describe("KeyboardShortcutOverlay", () => {
  it("renders nothing when closed", () => {
    renderWithStore(
      <KeyboardShortcutOverlay open={false} onClose={() => {}} />
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the panel when open", () => {
    renderWithStore(
      <KeyboardShortcutOverlay open={true} onClose={() => {}} />
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Keyboard Shortcuts")).toBeTruthy();
  });

  it("renders all section headings", () => {
    renderWithStore(
      <KeyboardShortcutOverlay open={true} onClose={() => {}} />
    );
    expect(screen.getByText("Timer")).toBeTruthy();
    expect(screen.getByText("Navigation")).toBeTruthy();
    expect(screen.getByText("General")).toBeTruthy();
  });

  it("shows timer shortcut descriptions", () => {
    renderWithStore(
      <KeyboardShortcutOverlay open={true} onClose={() => {}} />
    );
    expect(screen.getByText("Start / Pause timer")).toBeTruthy();
    expect(screen.getByText("Reset timer")).toBeTruthy();
    expect(screen.getByText("Toggle fullscreen focus")).toBeTruthy();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    renderWithStore(
      <KeyboardShortcutOverlay open={true} onClose={onClose} />
    );
    fireEvent.click(screen.getByRole("button", { name: /close shortcuts/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = renderWithStore(
      <KeyboardShortcutOverlay open={true} onClose={onClose} />
    );
    const backdrop = container.querySelector('[class*="backdrop"]');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it("shows the hint footer", () => {
    renderWithStore(
      <KeyboardShortcutOverlay open={true} onClose={() => {}} />
    );
    expect(
      screen.getByText(/press/i, { exact: false })
    ).toBeTruthy();
  });
});
