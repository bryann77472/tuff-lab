/* ============================================================
   BLOODMACH — save.js
   Estado do jogo, progressão, inventário e preferências.
   ============================================================ */
var BM = (window.BM = window.BM || {});

BM.save = (function () {
  'use strict';
  const D = BM.DATA;
  const KEY = 'bloodmach_save_v1';

  let data = null;
  const listeners = [];

  function defaults() {
    return {
      version: 1,
      createdAt: Date.now(),
      v1: { level: 1, xp: 0, scrap: 150, cores: 0 },
      owned: {
        arms: ['feedbacker', 'knuckleblaster', 'whiplash'],
        legs: ['servico'],
        chassis: ['v1']
      },
      equip: { legs: 'servico', chassis: 'v1' },
      loadout: ['jab_rapido', 'rajada_tres', 'puxao', 'soco_foguete'],
      items: { bolsa_sangue: 3, adrenalina: 1, moeda: 1 },
      progress: { layer: 0, node: 0, unlockedLayers: 1, checkpoint: null },
      flags: { tutorial: false, v2Dead: false, nucleo_v2: false, gabrielDead: false, ending: false, ngPlus: false },
      settings: {
        som: true, volume: 0.7, musica: 0.4, tremor: true,
        dificuldade: 'normal', parryAssist: false, textoRápido: false
      },
      stats: { batalhas: 0, vitorias: 0, mortes: 0, parries: 0, execucoes: 0, estiloMax: 0, fugas: 0 }
    };
  }

  /* ---------------- persistência ---------------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { data = null; return null; }
      const parsed = JSON.parse(raw);
      data = Object.assign(defaults(), parsed);
      // garante chaves internas
      const d = defaults();
      data.v1 = Object.assign(d.v1, parsed.v1 || {});
      data.owned = Object.assign(d.owned, parsed.owned || {});
      data.equip = Object.assign(d.equip, parsed.equip || {});
      data.progress = Object.assign(d.progress, parsed.progress || {});
      data.flags = Object.assign(d.flags, parsed.flags || {});
      data.settings = Object.assign(d.settings, parsed.settings || {});
      data.stats = Object.assign(d.stats, parsed.stats || {});
      data.items = parsed.items || d.items;
      if (!Array.isArray(data.loadout) || !data.loadout.length) data.loadout = d.loadout;
    } catch (e) { data = null; }
    return data;
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignora */ }
    emit();
  }

  function emit() { listeners.forEach(fn => { try { fn(data); } catch (e) { /* ignora */ } }); }
  function onChange(fn) { listeners.push(fn); }

  function newGame() {
    data = defaults();
    persist();
    return data;
  }

  function hasSave() { return !!load(); }

  function wipe() { try { localStorage.removeItem(KEY); } catch (e) { /* ignora */ } data = null; }

  /* ---------------- consultas ---------------- */
  function get() { if (!data) data = defaults(); return data; }
  function ownedArm(id) { return get().owned.arms.indexOf(id) >= 0; }
  function ownedLeg(id) { return get().owned.legs.indexOf(id) >= 0; }
  function ownedChassis(id) { return get().owned.chassis.indexOf(id) >= 0; }
  function armById(id) { return D.ARMS.find(a => a.id === id); }
  function moveById(id) { return D.MOVES[id]; }
  function armOfMove(id) { const m = D.MOVES[id]; return m ? D.ARMS.find(a => a.moves.indexOf(id) >= 0) : null; }

  /** BraçosLSL efetivamente equipados: braços distintos entre os 4 movimentos. */
  function equippedArms() {
    const set = [];
    get().loadout.forEach(mid => {
      const a = armOfMove(mid);
      if (a && set.indexOf(a.id) < 0) set.push(a.id);
    });
    return set;
  }

  function hasPassive(id) {
    return equippedArms().some(aid => {
      const a = armById(aid);
      return a && a.passive && a.passive.id === id;
    });
  }

  /** Braços que podem ser usados no loadout (possuídos). */
  function availableArms() { return D.ARMS.filter(a => ownedArm(a.id)); }

  function loadoutMoves() { return get().loadout.map(id => D.MOVES[id]).filter(Boolean); }

  /* ---------------- estatísticas do V1 ---------------- */
  function v1Stats() {
    const d = get();
    const lvl = d.v1.level;
    const chassis = D.CHASSIS.find(c => c.id === d.equip.chassis) || D.CHASSIS[0];
    const legs = D.LEGS.find(l => l.id === d.equip.legs) || D.LEGS[0];
    const maxHp = Math.round((140 + 10 * (lvl - 1)) * chassis.hp);
    const atk = 20 + 3 * (lvl - 1);
    const def = 16 + 2 * (lvl - 1);
    const vel = Math.max(1, Math.round((10 + (lvl - 1)) * chassis.vel * legs.vel));
    const peso = chassis.peso + legs.peso;
    const reflexo = Math.max(0.15, Math.min(0.85, 0.5 - 0.10 * peso));
    return {
      level: lvl, maxHp, atk, def, vel, peso, reflexo,
      esquiva: legs.esquiva, fuga: legs.fuga,
      legs, chassis
    };
  }

  /* ---------------- progressão ---------------- */
  function xpNeeded(level) { return 20 + 12 * level; }

  function addXp(amount) {
    const d = get();
    d.v1.xp += amount;
    const levels = [];
    while (d.v1.xp >= xpNeeded(d.v1.level) && d.v1.level < 20) {
      d.v1.xp -= xpNeeded(d.v1.level);
      d.v1.level++;
      levels.push(d.v1.level);
    }
    if (d.v1.level >= 20) d.v1.xp = 0;
    return levels;
  }

  function addScrap(n) { get().v1.scrap = Math.max(0, get().v1.scrap + n); }
  function addCores(n) { get().v1.cores = Math.max(0, get().v1.cores + n); }

  /* ---------------- compras ---------------- */
  function unlockState(kind, id) {
    const d = get();
    const item = kind === 'arm' ? armById(id)
      : kind === 'leg' ? D.LEGS.find(x => x.id === id)
      : kind === 'chassis' ? D.CHASSIS.find(x => x.id === id)
      : D.ITEMS.find(x => x.id === id);
    if (!item) return { ok: false, reason: 'ITEM INVÁLIDO' };
    const u = item.unlock;
    if (u === 'initial') return { ok: true, reason: '' };
    if (u === 'lvl3' && d.v1.level < 3) return { ok: false, reason: 'REQUER NÍVEL 3' };
    if (u === 'lvl6' && d.v1.level < 6) return { ok: false, reason: 'REQUER NÍVEL 6' };
    if (u === 'v2' && !d.flags.v2Dead) return { ok: false, reason: 'DERROTE V2' };
    if (u === 'nucleo_v2' && !d.flags.nucleo_v2) return { ok: false, reason: 'REQUER NÚCLEO DE V2' };
    return { ok: true, reason: '' };
  }

  function buy(kind, id) {
    const d = get();
    const st = unlockState(kind, id);
    if (!st.ok) return { ok: false, msg: st.reason };
    const item = kind === 'arm' ? armById(id)
      : kind === 'leg' ? D.LEGS.find(x => x.id === id)
      : kind === 'chassis' ? D.CHASSIS.find(x => x.id === id)
      : D.ITEMS.find(x => x.id === id);
    const price = item.price || 0;
    if (d.v1.scrap < price) return { ok: false, msg: 'SUCATA INSUFICIENTE' };
    if (kind === 'arm' && ownedArm(id)) return { ok: false, msg: 'JÁ ADQUIRIDO' };
    if (kind === 'leg' && ownedLeg(id)) return { ok: false, msg: 'JÁ ADQUIRIDO' };
    if (kind === 'chassis' && ownedChassis(id)) return { ok: false, msg: 'JÁ ADQUIRIDO' };
    d.v1.scrap -= price;
    if (kind === 'arm') d.owned.arms.push(id);
    if (kind === 'leg') d.owned.legs.push(id);
    if (kind === 'chassis') d.owned.chassis.push(id);
    if (kind === 'item') d.items[id] = (d.items[id] || 0) + 1;
    persist();
    return { ok: true, msg: 'COMPRADO' };
  }

  function equipLeg(id) { if (ownedLeg(id)) { get().equip.legs = id; persist(); } }
  function equipChassis(id) { if (ownedChassis(id)) { get().equip.chassis = id; persist(); } }

  function setLoadout(moves) {
    const d = get();
    d.loadout = moves.slice(0, 4);
    persist();
  }

  function toggleMove(moveId) {
    const d = get();
    const i = d.loadout.indexOf(moveId);
    if (i >= 0) { d.loadout.splice(i, 1); persist(); return; }
    if (d.loadout.length >= 4) return;
    d.loadout.push(moveId);
    persist();
  }

  function itemCount(id) { return get().items[id] || 0; }
  function useItem(id) {
    const d = get();
    if (!d.items[id]) return false;
    d.items[id]--;
    persist();
    return true;
  }

  /* ---------------- preferências ---------------- */
  function setSetting(key, value) { get().settings[key] = value; persist(); }

  function applySettings() {
    const s = get().settings;
    BM.audio.setEnabled(s.som);
    BM.audio.setVolume(s.volume);
    BM.audio.setMusicVolume(s.musica);
  }

  return {
    load, persist, newGame, hasSave, wipe, get, onChange,
    ownedArm, ownedLeg, ownedChassis, armById, moveById, armOfMove,
    equippedArms, hasPassive, availableArms, loadoutMoves,
    v1Stats, xpNeeded, addXp, addScrap, addCores,
    unlockState, buy, equipLeg, equipChassis, setLoadout, toggleMove,
    itemCount, useItem, setSetting, applySettings
  };
})();
