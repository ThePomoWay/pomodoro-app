import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AmbientSoundMixer } from './AmbientSoundMixer';

// ─── Mock Web Audio API ────────────────────────────────────────────────────────
function makeMockCtx() {
  const makeGain = () => ({
    gain: { value: 0.5, setTargetAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  });
  const makeFilter = () => ({
    type: '',
    frequency: { value: 0 },
    Q: { value: 0 },
    connect: vi.fn(),
  });
  const makeSource = () => ({
    buffer: null,
    loop: false,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });
  const makeOsc = () => ({
    type: 'sine',
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });

  return {
    state: 'running',
    sampleRate: 44100,
    currentTime: 0,
    destination: {},
    resume: vi.fn(),
    close: vi.fn().mockResolvedValue(undefined),
    createGain: vi.fn(makeGain),
    createBiquadFilter: vi.fn(makeFilter),
    createBufferSource: vi.fn(makeSource),
    createBuffer: vi.fn(() => ({
      getChannelData: vi.fn(() => new Float32Array(44100 * 3)),
    })),
    createOscillator: vi.fn(makeOsc),
    createStereoPanner: vi.fn(() => ({ pan: { value: 0 }, connect: vi.fn() })),
    createChannelMerger: vi.fn(() => ({ connect: vi.fn() })),
  };
}

beforeEach(() => {
  const ctx = makeMockCtx();
  // Must be regular functions (not arrows) so `new AudioContext()` works as a constructor.
  // When a constructor returns an object, that object is used — so `new AudioContext()` → ctx.
  global.AudioContext = function MockAudioContext() { return ctx; };
  global.webkitAudioContext = function MockWebkitAudioContext() { return ctx; };
});

afterEach(() => {
  delete global.AudioContext;
  delete global.webkitAudioContext;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AmbientSoundMixer', () => {
  it('renders nothing when open=false', () => {
    const { container } = render(
      <AmbientSoundMixer open={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the panel when open=true', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('dialog has aria-label "Ambient Sound Mixer"', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-label')).toBe('Ambient Sound Mixer');
  });

  it('displays all 6 sound channel labels', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    expect(screen.getByText('Rain')).toBeTruthy();
    expect(screen.getByText('Ocean')).toBeTruthy();
    expect(screen.getByText('Focus Noise')).toBeTruthy();
    expect(screen.getByText('Binaural')).toBeTruthy();
    expect(screen.getByText('Forest')).toBeTruthy();
    expect(screen.getByText('Café')).toBeTruthy();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<AmbientSoundMixer open={true} onClose={onClose} />);
    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when panel itself is clicked', () => {
    const onClose = vi.fn();
    render(<AmbientSoundMixer open={true} onClose={onClose} />);
    const panel = screen.getByRole('dialog');
    fireEvent.click(panel);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<AmbientSoundMixer open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close ambient sound mixer/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows "■ Stopped" EQ label when no sounds are active', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    expect(screen.getByText('■ Stopped')).toBeTruthy();
  });

  it('toggles a sound on when its button is clicked', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    const rainBtn = screen.getByRole('button', { name: /play rain/i });
    fireEvent.click(rainBtn);
    expect(rainBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('shows "▶ Playing" EQ label after activating a sound', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /play rain/i }));
    expect(screen.getByText('▶ Playing')).toBeTruthy();
  });

  it('shows "X playing" pill when a sound is active', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /play rain/i }));
    expect(screen.getByText('1 playing')).toBeTruthy();
  });

  it('toggles a sound off when its button is clicked again', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    const rainBtn = screen.getByRole('button', { name: /play rain/i });
    fireEvent.click(rainBtn);
    expect(rainBtn.getAttribute('aria-pressed')).toBe('true');
    const stopBtn = screen.getByRole('button', { name: /stop rain/i });
    fireEvent.click(stopBtn);
    expect(stopBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('renders volume sliders for all 6 channels', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(6);
  });

  it('volume sliders default to 0.5', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    const sliders = screen.getAllByRole('slider');
    sliders.forEach(slider => {
      expect(slider.value).toBe('0.5');
    });
  });

  it('updates volume when slider is changed', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '0.8' } });
    expect(sliders[0].value).toBe('0.8');
  });

  it('shows the title "Ambient Mixer"', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    expect(screen.getByText('Ambient Mixer')).toBeTruthy();
  });

  it('shows keyboard shortcut hints', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    expect(screen.getByText('M')).toBeTruthy();
    expect(screen.getByText('Esc')).toBeTruthy();
  });

  it('multiple sounds can be active simultaneously', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /play rain/i }));
    fireEvent.click(screen.getByRole('button', { name: /play ocean/i }));
    fireEvent.click(screen.getByRole('button', { name: /play forest/i }));
    expect(screen.getByText('3 playing')).toBeTruthy();
  });

  it('has aria-modal="true" on the dialog', () => {
    render(<AmbientSoundMixer open={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
  });
});
