import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SessionCompleteModal } from "./SessionCompleteModal";

// Mock canvas API (jsdom doesn't implement it).
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillRect: vi.fn(),
    set fillStyle(_) {},
    set globalAlpha(_) {},
  }));
});

// Stub rAF so neither the confetti loop nor the counter animation runs
// (avoids infinite recursion in jsdom which has no real animation frame).
beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockReturnValue(0);
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Mock Redux state ─────────────────────────────────────────────────────────

const mockCompletedTask = { fid: "t1", title: "Write docs", completed: true };

function timerReducer() {
  return {
    pomoState: "pomo_idle",
    timerInSec: 1500,
    completedPomos: 4,
    defaultWorkTime: 1500,
  };
}

function tasksReducer() {
  return {
    tasks: { t1: mockCompletedTask },
    todaysTasks: [],
    todaysCompletedTasks: ["t1"],
    allTasks: ["t1"],
    currentTaskRef: "",
    editTaskRef: "",
    allCompletedTasks: { from: "", to: "", tasks: [] },
  };
}

function globalReducer() {
  return {
    focusMode: false,
    isTimerFullScreen: false,
    theme: "dark",
    showAddTaskBtn: false,
    taskToBeEdited: null,
    onboardingModalOpen: false,
    projectModalOpen: false,
    labelModalOpen: false,
    toast: null,
    clockModalState: false,
    settings: { showModal: false, tab: 0 },
    userPreferences: {
      defaultWorkTime: 1500,
      defaultBreakTime: 300,
      defaultLongBreakTime: 900,
    },
  };
}

function makeStore() {
  return configureStore({
    reducer: {
      timer: timerReducer,
      tasks: tasksReducer,
      global: globalReducer,
    },
  });
}

function renderModal(props) {
  return render(
    <Provider store={makeStore()}>
      <SessionCompleteModal {...props} />
    </Provider>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("SessionCompleteModal", () => {
  it("renders nothing when open=false", () => {
    renderModal({ open: false, onClose: () => {}, completedPomos: 4 });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the dialog when open=true", () => {
    renderModal({ open: true, onClose: () => {}, completedPomos: 4 });
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("shows the first-session headline for 4 pomodoros", () => {
    renderModal({ open: true, onClose: () => {}, completedPomos: 4 });
    expect(screen.getByText("Session Complete!")).toBeTruthy();
  });

  it("shows 'On Fire!' headline for 8 pomodoros", () => {
    renderModal({ open: true, onClose: () => {}, completedPomos: 8 });
    expect(screen.getByText("On Fire!")).toBeTruthy();
  });

  it("shows 'Flow Master!' headline for 12 pomodoros", () => {
    renderModal({ open: true, onClose: () => {}, completedPomos: 12 });
    expect(screen.getByText("Flow Master!")).toBeTruthy();
  });

  it("shows stat labels", () => {
    renderModal({ open: true, onClose: () => {}, completedPomos: 4 });
    expect(screen.getByText("Pomodoros")).toBeTruthy();
    expect(screen.getByText("Tasks done")).toBeTruthy();
    expect(screen.getByText("Focus time")).toBeTruthy();
  });

  it("shows the next milestone hint", () => {
    renderModal({ open: true, onClose: () => {}, completedPomos: 4 });
    expect(screen.getByText(/next milestone/i)).toBeTruthy();
    expect(screen.getByText(/8 pomodoros/i)).toBeTruthy();
  });

  it("calls onClose when 'Keep going' is clicked", () => {
    const onClose = vi.fn();
    renderModal({ open: true, onClose, completedPomos: 4 });
    fireEvent.click(screen.getByRole("button", { name: /keep going/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when 'Take a break' is clicked", () => {
    const onClose = vi.fn();
    renderModal({ open: true, onClose, completedPomos: 4 });
    fireEvent.click(screen.getByRole("button", { name: /take a break/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    renderModal({ open: true, onClose, completedPomos: 4 });
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });

  it("does NOT propagate click from the card to the backdrop", () => {
    const onClose = vi.fn();
    const { container } = renderModal({ open: true, onClose, completedPomos: 4 });
    const card = container.querySelector('[class*="card"]');
    if (card) {
      fireEvent.click(card);
      // onClose called 0 times because the card stopsPropagation
      expect(onClose).not.toHaveBeenCalled();
    }
  });
});
