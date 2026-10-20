/* ============================================================
   BLOODMACH — main.js
   Fluxo do jogo: novo jogo, camadas, batalhas, progressão e final.
   ============================================================ */
var BM = (window.BM = window.BM || {});

BM.main = (function () {
  'use strict';
  const D = BM.DATA;

  let pending = null;   // { type:'tutorial'|'layer', layerIndex, enemyId }
  let battleHandled = false; // impede que o resultado seja processado duas vezes
  let currentHp = null; // HP do V1 entre batalhas da camada

  /* ---------------- boot ---------------- */
  function boot() {
    BM.save.load();
    BM.save.applySettings();
    BM.ui.title();
    document.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') {
        const c = BM.ui.current;
        if (c === 'options' || c === 'credits') { BM.audio.play('cancel'); backFromOptions(); }
      }
    });
  }

  /* ---------------- título ---------------- */
  function playPressed() {
    BM.audio.ensure();
    if (BM.save.hasSave()) {
      BM.save.load();
      BM.save.applySettings();
      continueGame();
    } else {
      newGame();
    }
  }

  function newGame() {
    BM.save.newGame();
    BM.save.applySettings();
    BM.audio.startAmbient();
    BM.ui.dialogue(D.STORY.intro, function () { beginTutorial(); });
  }

  function continueGame() {
    const d = BM.save.get();
    BM.audio.startAmbient();
    if (!d.flags.tutorial) { beginTutorial(); return; }
    currentHp = null;
    BM.ui.lobby();
  }

  function beginTutorial() {
    battleHandled = false;
    pending = { type: 'tutorial' };
    BM.battle.start({ enemyId: 'husk_glutao', layerIndex: 0 });
    BM.ui.battle();
  }

  /* ---------------- camadas ---------------- */
  function startLayer(index) {
    const d = BM.save.get();
    d.progress.layer = index;
    d.progress.node = 0;
    currentHp = null;
    BM.save.persist();
    BM.audio.play('confirm');
    BM.ui.layerMap(index);
  }

  function startBattle(enemyId, layerIndex) {
    if (BM.battle.state && !BM.battle.state.over) return; // já existe uma batalha em andamento
    battleHandled = false;
    const d = BM.save.get();
    const st = BM.save.v1Stats();
    const L = D.LAYERS[layerIndex];
    const node = d.progress.node;
    if (currentHp == null) currentHp = st.maxHp;
    // checkpoint: recupera parte da integridade
    if (L.checkpoints.indexOf(node) >= 0) {
      currentHp = Math.max(currentHp, Math.round(st.maxHp * 0.5));
    }
    pending = { type: 'layer', layerIndex: layerIndex, enemyId: enemyId };
    BM.battle.start({ enemyId: enemyId, layerIndex: layerIndex, hp: currentHp });
    BM.ui.battle();
  }

  /* ---------------- fim de batalha ---------------- */
  function onBattleOver(result) {
    const S = BM.battle.state;
    if (!S || S.overHandled) return;
    S.overHandled = true;
    const d = BM.save.get();
    d.stats.batalhas++;
    BM.save.persist();

    if (result === 'win') {
      d.stats.vitorias++;
      const en = D.ENEMIES[S.enemy.id];
      const rank = BM.battle.styleRank();
      const diff = D.DIFFICULTIES[d.settings.dificuldade] || D.DIFFICULTIES.normal;
      const scrap = Math.round(en.scrap * rank.mult * diff.scrap);
      const xp = en.exp;
      BM.save.addScrap(scrap);
      const levels = BM.save.addXp(xp);
      d.stats.estiloMax = Math.max(d.stats.estiloMax, S.style.points);
      currentHp = Math.min(BM.save.v1Stats().maxHp, S.player.hp + Math.round(BM.save.v1Stats().maxHp * 0.12));
      BM.save.persist();
      if (levels.length) { BM.audio.play('levelup'); BM.ui.toast('NÍVEL ' + levels[levels.length - 1] + '!', 'ok'); }
      BM.ui.result({
        result: 'win', rank: rank, stylePoints: S.style.points,
        scrap: scrap, xp: xp, levels: levels, enemyName: S.enemy.name
      });
    } else if (result === 'lose') {
      d.stats.mortes++;
      const lost = Math.round(d.v1.scrap * 0.2);
      BM.save.addScrap(-lost);
      currentHp = null;
      BM.save.persist();
      BM.audio.play('lose');
      BM.ui.result({ result: 'lose', lost: lost });
    } else {
      BM.audio.play('cancel');
      BM.ui.result({ result: 'fled' });
    }
  }

  function afterBattle(info) {
    if (battleHandled) return;
    battleHandled = true;
    const d = BM.save.get();
    if (info.result === 'win') {
      const S = BM.battle.state;
      BM.battle.end();
      if (pending && pending.type === 'tutorial') {
        d.flags.tutorial = true;
        BM.save.persist();
        currentHp = null;
        BM.ui.lobby();
        return;
      }
      const layerIndex = pending ? pending.layerIndex : d.progress.layer;
      d.progress.node++;
      BM.save.persist();
      if (S && S.enemy.isBoss) {
        onBossDefeated(layerIndex, S.enemy.id);
        return;
      }
      BM.ui.layerMap(layerIndex);
    } else if (info.result === 'lose') {
      BM.battle.end();
      if (pending && pending.type === 'tutorial') {
        BM.ui.dialogue([
          { who: 'MOTOR', text: 'SISTEMA CRÍTICO. O V1 foi consertado de novo. Tente outra vez.', portrait: 'motor' }
        ], function () {
          pending = { type: 'tutorial' };
          BM.battle.start({ enemyId: 'husk_glutao', layerIndex: 0 });
          BM.ui.battle();
        });
        return;
      }
      const layerIndex = pending ? pending.layerIndex : d.progress.layer;
      d.progress.node = 0;
      BM.save.persist();
      BM.ui.layerMap(layerIndex);
    } else {
      BM.battle.end();
      const layerIndex = pending ? pending.layerIndex : d.progress.layer;
      BM.ui.layerMap(layerIndex);
    }
  }

  function useRepairKit() {
    const d = BM.save.get();
    if (!BM.save.useItem('kit_reparo')) return;
    const st = BM.save.v1Stats();
    currentHp = Math.round(st.maxHp * 0.3);
    BM.audio.play('heal');
    BM.ui.toast('Kit de Reparo usado. Integridade restaurada.', 'ok');
    const layerIndex = pending && pending.type === 'layer' ? pending.layerIndex : d.progress.layer;
    if (pending && pending.type === 'tutorial') {
      pending = { type: 'tutorial' };
      BM.battle.start({ enemyId: 'husk_glutao', layerIndex: 0, hp: currentHp });
      BM.ui.battle();
      return;
    }
    BM.battle.start({ enemyId: pending ? pending.enemyId : D.LAYERS[layerIndex].encounters[0], layerIndex: layerIndex, hp: currentHp });
    BM.ui.battle();
  }

  function onBossDefeated(layerIndex, bossId) {
    const d = BM.save.get();
    if (bossId === 'v2') {
      d.flags.v2Dead = true;
      d.flags.nucleo_v2 = true;
      d.v1.cores = d.v1.cores + 1;
      d.progress.unlockedLayers = Math.max(d.progress.unlockedLayers, 2);
      d.progress.node = 0;
      BM.save.persist();
      BM.ui.dialogue(D.STORY.afterV2, function () {
        currentHp = null;
        BM.ui.lobby();
      });
      return;
    }
    if (bossId === 'gabriel') {
      d.flags.gabrielDead = true;
      BM.save.persist();
      BM.ui.dialogue(D.STORY.gabrielAfter, function () {
        BM.ui.dialogue(D.STORY.ending, function () {
          BM.ui.ending();
        });
      });
      return;
    }
    currentHp = null;
    BM.ui.lobby();
  }

  function finishGame() {
    const d = BM.save.get();
    d.flags.ending = true;
    BM.save.persist();
    BM.ui.postCredits();
  }

  /* ---------------- telas auxiliares ---------------- */
  function openLoadout(returnTo) {
    BM.ui.loadout(returnTo || 'lobby');
  }

  function backFromOptions() {
    const d = BM.save.get();
    if (d && d.flags.tutorial) BM.ui.lobby(); else BM.ui.title();
  }

  return {
    boot, playPressed, newGame, continueGame, beginTutorial,
    startLayer, startBattle, onBattleOver, afterBattle, useRepairKit,
    finishGame, openLoadout, backFromOptions
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  BM.main.boot();
});
