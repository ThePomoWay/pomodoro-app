# FocusLounge Sprint Log

## 2026-03-29 — Keyboard Shortcut Overlay
**Description:** A gorgeous glassmorphism-style modal overlay (triggered by pressing `?` or clicking the floating `?` badge) that lists all keyboard shortcuts in categorized sections. The shortcuts are fully functional: `Space` starts/pauses the timer, `R` resets it, `F` toggles fullscreen focus mode, `Esc` closes the overlay. A subtle floating badge in the bottom-right corner hints at the feature for new users.
**Files changed:** src/common/components/keyboard-shortcut-overlay/KeyboardShortcutOverlay.jsx, KeyboardShortcutOverlay.module.scss, KeyboardShortcutOverlay.test.jsx; src/pages/dashboard/laptop/homepage-view.jsx (integration)
**Tests:** src/common/components/keyboard-shortcut-overlay/KeyboardShortcutOverlay.test.jsx (7 tests)

## 2026-03-29 — Mindful Breathing Break
**Description:** Animated 4-7-8 breathing exercise guide that appears when a break starts, with a glowing pulsing orb and phase guidance.
**Files changed:** src/common/components/breathing-exercise/BreathingExercise.jsx, BreathingExercise.module.scss, BreathingExercise.test.jsx; integrated into dashboard homepage-view.jsx
**Tests:** src/common/components/breathing-exercise/BreathingExercise.test.jsx
