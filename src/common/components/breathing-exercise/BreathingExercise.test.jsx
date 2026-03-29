import { render, screen, fireEvent } from '@testing-library/react';
import { BreathingExercise } from './BreathingExercise';

describe('BreathingExercise', () => {
  it('renders the breathing phase text', () => {
    render(<BreathingExercise onDismiss={() => {}} />);
    expect(screen.getByText('Breathe in...')).toBeTruthy();
  });

  it('shows skip button', () => {
    render(<BreathingExercise onDismiss={() => {}} />);
    expect(screen.getByRole('button', { name: /skip/i })).toBeTruthy();
  });

  it('calls onDismiss when skip is clicked', () => {
    const onDismiss = vi.fn();
    render(<BreathingExercise onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders round counter', () => {
    render(<BreathingExercise onDismiss={() => {}} />);
    expect(screen.getByText('Round 1 of 3')).toBeTruthy();
  });
});
