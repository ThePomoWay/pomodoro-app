import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AmbientSoundMixer.module.scss';

// ─── Sound definitions ──────────────────────────────────────────────────────
const SOUNDS = [
  { id: 'rain',     label: 'Rain',        emoji: '🌧',  color: '#6fa8dc', noiseType: 'white', filterType: 'lowpass',  filterFreq: 800,  filterQ: 1.0 },
  { id: 'ocean',    label: 'Ocean',       emoji: '🌊',  color: '#4fc3f7', noiseType: 'brown', filterType: 'lowpass',  filterFreq: 400,  filterQ: 0.7 },
  { id: 'white',    label: 'Focus Noise', emoji: '〰',   color: '#b0bec5', noiseType: 'white', filterType: null,       filterFreq: null, filterQ: null },
  { id: 'binaural', label: 'Binaural',    emoji: '🧠',  color: '#ce93d8', noiseType: 'tone',  filterType: null,       filterFreq: 200,  filterQ: null },
  { id: 'forest',   label: 'Forest',      emoji: '🌿',  color: '#81c784', noiseType: 'white', filterType: 'bandpass', filterFreq: 700,  filterQ: 1.8 },
  { id: 'cafe',     label: 'Café',        emoji: '☕',  color: '#ffb74d', noiseType: 'brown', filterType: 'bandpass', filterFreq: 1800, filterQ: 0.9 },
];

// Pre-computed EQ bar data (avoids Math.random() in render)
const EQ_BAR_DATA = [
  { delay: 0.00, speed: 0.45, maxH: 38 }, { delay: 0.07, speed: 0.31, maxH: 62 },
  { delay: 0.14, speed: 0.52, maxH: 48 }, { delay: 0.21, speed: 0.38, maxH: 75 },
  { delay: 0.28, speed: 0.44, maxH: 55 }, { delay: 0.35, speed: 0.29, maxH: 82 },
  { delay: 0.10, speed: 0.56, maxH: 42 }, { delay: 0.42, speed: 0.41, maxH: 68 },
  { delay: 0.05, speed: 0.35, maxH: 58 }, { delay: 0.49, speed: 0.47, maxH: 88 },
  { delay: 0.18, speed: 0.33, maxH: 45 }, { delay: 0.56, speed: 0.53, maxH: 72 },
  { delay: 0.25, speed: 0.39, maxH: 60 }, { delay: 0.63, speed: 0.43, maxH: 50 },
  { delay: 0.32, speed: 0.49, maxH: 78 }, { delay: 0.70, speed: 0.36, maxH: 40 },
  { delay: 0.11, speed: 0.42, maxH: 66 }, { delay: 0.77, speed: 0.54, maxH: 84 },
  { delay: 0.39, speed: 0.30, maxH: 53 }, { delay: 0.84, speed: 0.46, maxH: 70 },
];

// ─── Web Audio helpers ───────────────────────────────────────────────────────
function buildWhiteNoiseBuffer(ctx) {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function buildBrownNoiseBuffer(ctx) {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    data[i] = (last + 0.02 * w) / 1.02;
    last = data[i];
    data[i] *= 3.5;
  }
  return buf;
}

function createSoundNodes(ctx, soundDef, volume) {
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(ctx.destination);

  if (soundDef.noiseType === 'tone') {
    // Binaural beat: 200Hz left ear, 208Hz right ear → 8Hz alpha wave
    const merger = ctx.createChannelMerger(2);
    merger.connect(gain);

    const oscL = ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.value = soundDef.filterFreq;
    const panL = ctx.createStereoPanner();
    panL.pan.value = -1;
    oscL.connect(panL);
    panL.connect(merger, 0, 0);
    oscL.start();

    const oscR = ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.value = soundDef.filterFreq + 8;
    const panR = ctx.createStereoPanner();
    panR.pan.value = 1;
    oscR.connect(panR);
    panR.connect(merger, 0, 1);
    oscR.start();

    return { type: 'tone', oscillators: [oscL, oscR], extraNodes: [panL, panR, merger], gain };
  }

  // Noise-based sounds
  const buf =
    soundDef.noiseType === 'brown'
      ? buildBrownNoiseBuffer(ctx)
      : buildWhiteNoiseBuffer(ctx);

  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;

  if (soundDef.filterType) {
    const filter = ctx.createBiquadFilter();
    filter.type = soundDef.filterType;
    filter.frequency.value = soundDef.filterFreq;
    if (soundDef.filterQ) filter.Q.value = soundDef.filterQ;
    source.connect(filter);
    filter.connect(gain);
    source.start();
    return { type: 'noise', source, filter, gain };
  }

  source.connect(gain);
  source.start();
  return { type: 'noise', source, gain };
}

function teardownNodes(nodes) {
  if (!nodes) return;
  try {
    if (nodes.type === 'tone') {
      nodes.oscillators?.forEach(osc => { try { osc.stop(); } catch {} });
    } else {
      nodes.source?.stop();
    }
    nodes.gain?.disconnect();
  } catch {}
}

// ─── Component ───────────────────────────────────────────────────────────────
const INITIAL_VOLUMES = Object.fromEntries(SOUNDS.map(s => [s.id, 0.5]));
const INITIAL_ACTIVE  = Object.fromEntries(SOUNDS.map(s => [s.id, false]));

export function AmbientSoundMixer({ open, onClose }) {
  const [volumes, setVolumes] = useState(INITIAL_VOLUMES);
  const [active,  setActive]  = useState(INITIAL_ACTIVE);
  const [visible, setVisible] = useState(false);

  const ctxRef   = useRef(null);
  const nodesRef = useRef({});

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stopSound = useCallback((id) => {
    teardownNodes(nodesRef.current[id]);
    delete nodesRef.current[id];
  }, []);

  const startSound = useCallback((soundDef, vol) => {
    const ctx = getCtx();
    nodesRef.current[soundDef.id] = createSoundNodes(ctx, soundDef, vol);
  }, [getCtx]);

  const toggleSound = useCallback((sound) => {
    setActive(prev => {
      const next = !prev[sound.id];
      if (next) {
        startSound(sound, volumes[sound.id]);
      } else {
        stopSound(sound.id);
      }
      return { ...prev, [sound.id]: next };
    });
  }, [startSound, stopSound, volumes]);

  const handleVolumeChange = useCallback((id, val) => {
    setVolumes(prev => ({ ...prev, [id]: val }));
    const nodes = nodesRef.current[id];
    if (nodes?.gain && ctxRef.current) {
      nodes.gain.gain.setTargetAtTime(val, ctxRef.current.currentTime, 0.01);
    }
  }, []);

  // Slide-in animation
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      SOUNDS.forEach(s => stopSound(s.id));
      ctxRef.current?.close().catch(() => {});
    };
  }, [stopSound]);

  if (!open) return null;

  const anyActive = Object.values(active).some(Boolean);
  const activeCount = Object.values(active).filter(Boolean).length;

  return (
    <div
      className={`${styles.backdrop} ${visible ? styles.backdropVisible : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`${styles.panel} ${visible ? styles.panelVisible : ''}`}
        role="dialog"
        aria-label="Ambient Sound Mixer"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.titleIcon} aria-hidden="true">♫</span>
            <h2 className={styles.title}>Ambient Mixer</h2>
            {activeCount > 0 && (
              <span className={styles.activePill}>{activeCount} playing</span>
            )}
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close ambient sound mixer"
          >
            ✕
          </button>
        </div>

        <p className={styles.subtitle}>
          Layer sounds to build your perfect focus environment
        </p>

        {/* Sound grid */}
        <div className={styles.grid}>
          {SOUNDS.map(sound => (
            <div
              key={sound.id}
              className={`${styles.card} ${active[sound.id] ? styles.cardActive : ''}`}
              style={{ '--sound-color': sound.color }}
            >
              <button
                className={styles.toggleBtn}
                onClick={() => toggleSound(sound)}
                aria-pressed={active[sound.id]}
                aria-label={`${active[sound.id] ? 'Stop' : 'Play'} ${sound.label}`}
              >
                <span className={styles.emoji} aria-hidden="true">{sound.emoji}</span>
                <span className={styles.soundLabel}>{sound.label}</span>
                <span
                  className={`${styles.indicator} ${active[sound.id] ? styles.indicatorOn : ''}`}
                  aria-hidden="true"
                />
              </button>

              <div className={styles.sliderRow}>
                <span className={styles.volIcon} aria-hidden="true">
                  {volumes[sound.id] < 0.01 ? '🔇' : volumes[sound.id] < 0.5 ? '🔉' : '🔊'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes[sound.id]}
                  onChange={e => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                  className={`${styles.slider} ${!active[sound.id] ? styles.sliderDisabled : ''}`}
                  aria-label={`${sound.label} volume`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* EQ Visualizer */}
        <div className={styles.eqSection} aria-hidden="true">
          <div className={`${styles.eqBars} ${anyActive ? styles.eqPlaying : ''}`}>
            {EQ_BAR_DATA.map((bar, i) => (
              <div
                key={i}
                className={styles.eqBar}
                style={{
                  '--bar-delay':  `${bar.delay}s`,
                  '--bar-speed':  `${bar.speed}s`,
                  '--bar-max-h':  `${bar.maxH}%`,
                }}
              />
            ))}
          </div>
          <p className={styles.eqLabel}>
            {anyActive ? '▶ Playing' : '■ Stopped'}
          </p>
        </div>

        {/* Keyboard hint */}
        <p className={styles.hint}>
          Press <kbd className={styles.kbd}>M</kbd> to toggle · <kbd className={styles.kbd}>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
