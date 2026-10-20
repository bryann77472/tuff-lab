/* ============================================================
   BLOODMACH — audio.js
   Efeitos sintetizados via WebAudio (sem arquivos externos).
   ============================================================ */
var BM = (window.BM = window.BM || {});

BM.audio = (function () {
  'use strict';

  let ctx = null, master = null, sfx = null, music = null, ambientOn = false, ambientNodes = null;
  let enabled = true, volume = 0.7, musicVolume = 0.4;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = volume; master.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.gain.value = 1; sfx.connect(master);
    music = ctx.createGain(); music.gain.value = musicVolume; music.connect(master);
    return ctx;
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  function noiseBuffer(dur) {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    return buf;
  }

  function tone(opts) {
    if (!enabled || !ensure()) return;
    const t = now() + (opts.delay || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.freq, t);
    if (opts.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), t + opts.dur);
    const vol = (opts.vol == null ? 0.25 : opts.vol);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, opts.dur * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
    let node = osc;
    if (opts.filter) {
      const f = ctx.createBiquadFilter();
      f.type = opts.filter; f.frequency.value = opts.filterFreq || 900; f.Q.value = opts.q || 1;
      osc.connect(f); node = f;
    }
    node.connect(g); g.connect(opts.bus || sfx);
    osc.start(t); osc.stop(t + opts.dur + 0.05);
  }

  function noise(opts) {
    if (!enabled || !ensure()) return;
    const t = now() + (opts.delay || 0);
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(opts.dur);
    const f = ctx.createBiquadFilter();
    f.type = opts.filter || 'bandpass';
    f.frequency.setValueAtTime(opts.freq || 1200, t);
    if (opts.to) f.frequency.exponentialRampToValueAtTime(Math.max(60, opts.to), t + opts.dur);
    f.Q.value = opts.q || 1;
    const g = ctx.createGain();
    const vol = (opts.vol == null ? 0.3 : opts.vol);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
    src.connect(f); f.connect(g); g.connect(opts.bus || sfx);
    src.start(t); src.stop(t + opts.dur + 0.02);
  }

  const SFX = {
    select()   { tone({ type:'square', freq:520, to:640, dur:0.06, vol:0.10 }); },
    confirm()  { tone({ type:'square', freq:380, to:760, dur:0.10, vol:0.13 }); },
    cancel()   { tone({ type:'square', freq:320, to:180, dur:0.10, vol:0.11 }); },
    hit()      { noise({ freq:1800, to:400, dur:0.14, vol:0.30 }); tone({ type:'square', freq:180, to:70, dur:0.12, vol:0.16 }); },
    crit()     { noise({ freq:2600, to:500, dur:0.20, vol:0.34 }); tone({ type:'sawtooth', freq:300, to:80, dur:0.20, vol:0.20 }); },
    heavy()    { noise({ freq:700, to:90, dur:0.34, vol:0.40, filter:'lowpass' }); tone({ type:'sine', freq:120, to:40, dur:0.36, vol:0.30 }); },
    block()    { tone({ type:'square', freq:900, to:300, dur:0.10, vol:0.16 }); noise({ freq:3000, dur:0.08, vol:0.14 }); },
    parry()    { tone({ type:'triangle', freq:1200, to:2400, dur:0.22, vol:0.30 }); tone({ type:'sine', freq:2400, dur:0.35, vol:0.16, delay:0.03 }); },
    parryMiss(){ noise({ freq:400, to:120, dur:0.22, vol:0.22 }); },
    heal()     { tone({ type:'sine', freq:420, to:880, dur:0.30, vol:0.16 }); },
    blood()    { noise({ freq:600, to:160, dur:0.26, vol:0.22, filter:'lowpass' }); },
    ko()       { tone({ type:'sawtooth', freq:260, to:45, dur:0.85, vol:0.28 }); noise({ freq:500, to:80, dur:0.7, vol:0.20, filter:'lowpass' }); },
    win()      { [523, 659, 784, 1046].forEach((f, i) => tone({ type:'triangle', freq:f, dur:0.42, vol:0.16, delay:i * 0.10 })); },
    lose()     { [392, 330, 262, 196].forEach((f, i) => tone({ type:'sine', freq:f, dur:0.5, vol:0.16, delay:i * 0.14 })); },
    buy()      { tone({ type:'square', freq:880, dur:0.07, vol:0.12 }); tone({ type:'square', freq:1320, dur:0.10, vol:0.10, delay:0.07 }); },
    levelup()  { [392, 523, 659, 880, 1046].forEach((f, i) => tone({ type:'triangle', freq:f, dur:0.34, vol:0.13, delay:i * 0.07 })); },
    warn()     { tone({ type:'square', freq:220, to:180, dur:0.20, vol:0.13 }); },
    start()    { tone({ type:'sawtooth', freq:70, to:40, dur:1.1, vol:0.22, filter:'lowpass', filterFreq:400 }); },
    shutdown() { [440, 349, 262, 196, 147].forEach((f, i) => tone({ type:'sine', freq:f, dur:0.7, vol:0.14, delay:i * 0.18 })); },
  };

  /* -------- ambiente -------- */
  function startAmbient() {
    if (!ensure() || ambientOn) return;
    ambientOn = true;
    const g = ctx.createGain(); g.gain.value = 0.0; g.connect(music);
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 41;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 62;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220; f.Q.value = 2;
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer(4); n.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 420; nf.Q.value = 0.7;
    const ng = ctx.createGain(); ng.gain.value = 0.10;
    o1.connect(f); o2.connect(f); f.connect(g);
    n.connect(nf); nf.connect(ng); ng.connect(g);
    g.gain.linearRampToValueAtTime(0.5, now() + 2.5);
    o1.start(); o2.start(); n.start();
    ambientNodes = { o1, o2, n, g };
  }
  function stopAmbient() {
    if (!ambientNodes) return;
    const { o1, o2, n, g } = ambientNodes;
    try {
      g.gain.cancelScheduledValues(now());
      g.gain.setValueAtTime(g.gain.value, now());
      g.gain.linearRampToValueAtTime(0.0001, now() + 0.8);
      o1.stop(now() + 0.9); o2.stop(now() + 0.9); n.stop(now() + 0.9);
    } catch (e) { /* ignora */ }
    ambientNodes = null; ambientOn = false;
  }

  return {
    play(name) { const f = SFX[name]; if (f) { try { f(); } catch (e) { /* ignora */ } } },
    ensure,
    setEnabled(v) { enabled = !!v; if (!enabled && ctx) master.gain.value = 0; else if (enabled && ctx) master.gain.value = volume; },
    setVolume(v) { volume = v; if (ctx) master.gain.value = enabled ? v : 0; },
    setMusicVolume(v) { musicVolume = v; if (ctx) music.gain.value = v; },
    getVolume() { return volume; },
    getMusicVolume() { return musicVolume; },
    startAmbient, stopAmbient,
    get ambient() { return ambientOn; }
  };
})();
