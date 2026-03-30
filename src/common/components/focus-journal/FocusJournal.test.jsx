import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  FocusJournal,
  JournalPrompt,
  JournalBadge,
  saveJournalEntry,
  readJournalEntries,
  JOURNAL_LS_KEY,
} from './FocusJournal';

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── saveJournalEntry / readJournalEntries ────────────────────────────────────

describe('saveJournalEntry', () => {
  it('saves a note with all fields', () => {
    saveJournalEntry({ note: 'Finished auth module', taskName: 'Auth', sessionNum: 3 });
    const entries = readJournalEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].note).toBe('Finished auth module');
    expect(entries[0].taskName).toBe('Auth');
    expect(entries[0].sessionNum).toBe(3);
    expect(typeof entries[0].id).toBe('string');
    expect(typeof entries[0].timestamp).toBe('number');
  });

  it('trims whitespace from note', () => {
    saveJournalEntry({ note: '  trimmed  ' });
    expect(readJournalEntries()[0].note).toBe('trimmed');
  });

  it('does not save blank or whitespace-only notes', () => {
    saveJournalEntry({ note: '   ' });
    saveJournalEntry({ note: '' });
    expect(readJournalEntries()).toHaveLength(0);
  });

  it('prepends new entries (newest first)', () => {
    saveJournalEntry({ note: 'First' });
    saveJournalEntry({ note: 'Second' });
    const entries = readJournalEntries();
    expect(entries[0].note).toBe('Second');
    expect(entries[1].note).toBe('First');
  });

  it('caps storage at 200 entries', () => {
    for (let i = 0; i < 205; i++) saveJournalEntry({ note: `Note ${i}` });
    expect(readJournalEntries()).toHaveLength(200);
  });

  it('handles missing taskName gracefully', () => {
    saveJournalEntry({ note: 'No task' });
    expect(readJournalEntries()[0].taskName).toBe('');
  });
});

describe('readJournalEntries', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(readJournalEntries()).toEqual([]);
  });

  it('returns empty array when localStorage holds corrupt JSON', () => {
    localStorage.setItem(JOURNAL_LS_KEY, 'NOT_VALID_JSON');
    expect(readJournalEntries()).toEqual([]);
  });
});

// ─── FocusJournal modal ───────────────────────────────────────────────────────

describe('FocusJournal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<FocusJournal open={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the modal when open', () => {
    render(<FocusJournal open={true} onClose={() => {}} />);
    // getByRole throws if not found — implicit presence assertion
    screen.getByRole('dialog');
    screen.getByText('Focus Journal');
  });

  it('shows empty state when no entries exist', () => {
    render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText(/No journal entries yet/i);
  });

  it('displays a saved note', () => {
    saveJournalEntry({ note: 'Completed homepage redesign', taskName: 'UI', sessionNum: 2 });
    render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText('Completed homepage redesign');
  });

  it('shows task badge when taskName is set', () => {
    saveJournalEntry({ note: 'Done', taskName: 'My Task', sessionNum: 1 });
    render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText(/My Task/);
  });

  it('shows session badge with # prefix', () => {
    saveJournalEntry({ note: 'Done', taskName: '', sessionNum: 5 });
    render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText('#5');
  });

  it('reflects entry count in subtitle', () => {
    saveJournalEntry({ note: 'Note one' });
    saveJournalEntry({ note: 'Note two' });
    render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText(/2 session notes/i);
  });

  it('uses singular "note" for a single entry', () => {
    saveJournalEntry({ note: 'Solo note' });
    render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText(/1 session note/i);
    expect(screen.queryByText(/1 session notes/i)).toBeNull();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<FocusJournal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<FocusJournal open={true} onClose={onClose} />);
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when the panel itself is clicked', () => {
    const onClose = vi.fn();
    render(<FocusJournal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows search input when more than 3 entries exist', () => {
    for (let i = 0; i < 4; i++) saveJournalEntry({ note: `Note ${i}` });
    render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByLabelText(/Search journal notes/i);
  });

  it('hides search input when 3 or fewer entries', () => {
    for (let i = 0; i < 3; i++) saveJournalEntry({ note: `Note ${i}` });
    render(<FocusJournal open={true} onClose={() => {}} />);
    expect(screen.queryByLabelText(/Search journal notes/i)).toBeNull();
  });

  it('filters entries matching search term', () => {
    saveJournalEntry({ note: 'Auth module done' });
    saveJournalEntry({ note: 'Fixed CSS bug' });
    saveJournalEntry({ note: 'Deploy pipeline' });
    saveJournalEntry({ note: 'Auth tests passing' });
    render(<FocusJournal open={true} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText(/Search journal notes/i), {
      target: { value: 'auth' },
    });
    screen.getByText('Auth module done');
    screen.getByText('Auth tests passing');
    expect(screen.queryByText('Fixed CSS bug')).toBeNull();
  });

  it('filters entries by taskName', () => {
    saveJournalEntry({ note: 'Worked on it', taskName: 'Backend API' });
    saveJournalEntry({ note: 'Also worked', taskName: 'Frontend UI' });
    saveJournalEntry({ note: 'Third note', taskName: 'Backend API' });
    saveJournalEntry({ note: 'Fourth note', taskName: 'Other' });
    render(<FocusJournal open={true} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText(/Search journal notes/i), {
      target: { value: 'Backend' },
    });
    screen.getByText('Worked on it');
    screen.getByText('Third note');
    expect(screen.queryByText('Also worked')).toBeNull();
  });

  it('shows no-match message when search finds nothing', () => {
    for (let i = 0; i < 4; i++) saveJournalEntry({ note: `Note ${i}` });
    render(<FocusJournal open={true} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText(/Search journal notes/i), {
      target: { value: 'zzznomatch' },
    });
    screen.getByText(/No matching notes/i);
  });

  it('reloads entries when re-opened', () => {
    const { rerender } = render(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText(/No journal entries yet/i);

    rerender(<FocusJournal open={false} onClose={() => {}} />);
    saveJournalEntry({ note: 'Added while closed' });
    rerender(<FocusJournal open={true} onClose={() => {}} />);
    screen.getByText('Added while closed');
  });
});

// ─── JournalPrompt ────────────────────────────────────────────────────────────

describe('JournalPrompt', () => {
  it('renders session number', () => {
    render(
      <JournalPrompt sessionNum={4} taskName="" onSave={() => {}} onDismiss={() => {}} />,
    );
    screen.getByText(/Session 4 complete/i);
  });

  it('renders task name when provided', () => {
    render(
      <JournalPrompt sessionNum={1} taskName="API work" onSave={() => {}} onDismiss={() => {}} />,
    );
    screen.getByText(/API work/);
  });

  it('does not render task name when empty', () => {
    const { container } = render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={() => {}} />,
    );
    expect(container.querySelector('.promptTask')).toBeNull();
  });

  it('shows countdown starting at 30', () => {
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={() => {}} />,
    );
    screen.getByText('30');
  });

  it('decrements countdown each second', () => {
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={() => {}} />,
    );
    act(() => { vi.advanceTimersByTime(5000); });
    screen.getByText('25');
  });

  it('auto-dismisses after 30 seconds', () => {
    const onDismiss = vi.fn();
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={onDismiss} />,
    );
    act(() => { vi.advanceTimersByTime(30000); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('save button is disabled when note is empty', () => {
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={() => {}} />,
    );
    expect(screen.getByText(/Save note/).disabled).toBe(true);
  });

  it('save button is enabled when note has text', () => {
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={() => {}} />,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Some work done' } });
    expect(screen.getByText(/Save note/).disabled).toBe(false);
  });

  it('calls onSave and persists entry when note submitted via button', () => {
    const onSave = vi.fn();
    render(
      <JournalPrompt sessionNum={2} taskName="Task A" onSave={onSave} onDismiss={() => {}} />,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Great progress!' } });
    fireEvent.click(screen.getByText(/Save note/));
    expect(onSave).toHaveBeenCalledTimes(1);
    const entries = readJournalEntries();
    expect(entries[0].note).toBe('Great progress!');
    expect(entries[0].taskName).toBe('Task A');
    expect(entries[0].sessionNum).toBe(2);
  });

  it('submits note on Enter key press', () => {
    const onSave = vi.fn();
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={onSave} onDismiss={() => {}} />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Enter key submit' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('does not submit on Shift+Enter', () => {
    const onSave = vi.fn();
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={onSave} onDismiss={() => {}} />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'multiline' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('calls onDismiss when Escape is pressed', () => {
    const onDismiss = vi.fn();
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={onDismiss} />,
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when Skip button clicked', () => {
    const onDismiss = vi.fn();
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={() => {}} onDismiss={onDismiss} />,
    );
    fireEvent.click(screen.getByText('Skip'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss (not onSave) when Enter pressed with empty note', () => {
    const onSave = vi.fn();
    const onDismiss = vi.fn();
    render(
      <JournalPrompt sessionNum={1} taskName="" onSave={onSave} onDismiss={onDismiss} />,
    );
    // note is empty → handleSave calls onDismiss
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSave).not.toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

// ─── JournalBadge ─────────────────────────────────────────────────────────────

describe('JournalBadge', () => {
  it('renders with correct aria-label', () => {
    render(<JournalBadge onClick={() => {}} hasNewEntry={false} />);
    screen.getByLabelText('Open focus journal');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<JournalBadge onClick={onClick} hasNewEntry={false} />);
    fireEvent.click(screen.getByLabelText('Open focus journal'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
