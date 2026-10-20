/* ============================================================
   BLOODMACH — ui.js
   Todas as telas: título, loja, loadout, lobby, mapa, diálogo,
   batalha, parry, resultados, opções, final e créditos.
   ============================================================ */
var BM = (window.BM = window.BM || {});

BM.ui = (function () {
  'use strict';
  const D = BM.DATA;
  const app = () => document.getElementById('app');

  let current = 'title';
  let shopReturn = 'title';
  let loadoutReturn = 'lobby';
  let dialogueQueue = null;

  /* ---------------- helpers ---------------- */
  const el = sel => app().querySelector(sel);
  const els = sel => Array.prototype.slice.call(app().querySelectorAll(sel));
  const fmt = n => Number(n).toLocaleString('pt-BR');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function mount(html) { app().innerHTML = html; }
  function on(sel, ev, fn) { els(sel).forEach(n => n.addEventListener(ev, fn)); }
  function toast(msg, kind) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 2200);
  }

  /* =========================================================
     TÍTULO
     ========================================================= */
  function title() {
    current = 'title';
    const has = BM.save.hasSave();
    const d = has ? BM.save.get() : null;
    mount(`
      <div class="screen title-screen">
        <div class="title-bg">${BM.sprites.arena({ a:'#7d1f16', b:'#140a0c', c:'#d8b25a' })}</div>
        <div class="title-glow"></div>
        <div class="title-v1">${BM.sprites.v1('#4aa8ff')}</div>
        <div class="title-inner">
          <div class="logo-wrap">
            <h1 class="title-xl">BLOODMACH</h1>
            <div class="logo-drip"></div>
          </div>
          <div class="logo-sub">Gluttony&nbsp;&nbsp;//&nbsp;&nbsp;Heresy</div>
          <div class="title-menu">
            <button class="btn primary" data-a="play">${has ? 'Continuar' : 'Jogar'}</button>
            <button class="btn" data-a="shop">Loja ${has && d ? '<span class="badge hot">NOVO</span>' : ''}</button>
            <button class="btn" data-a="options">Opções</button>
            <button class="btn" data-a="credits">Créditos</button>
          </div>
          ${has ? `<div class="dim" style="margin-top:18px;font-size:.72rem">
            NÍVEL ${d.v1.level} · ${fmt(d.v1.scrap)} SUCATA · ${d.flags.v2Dead ? 'V2 MORTO' : 'V2 VIVO'}
          </div>` : ''}
        </div>
        <div class="title-foot">V1 — PROTÓTIPO DE SÉRIAÇÃO 01 · SEM ARMAS, SÓ SANGUE</div>
      </div>`);
    on('.title-menu .btn', 'click', ev => {
      const a = ev.currentTarget.getAttribute('data-a');
      BM.audio.play('select');
      if (a === 'play') BM.main.playPressed();
      if (a === 'shop') { shopReturn = 'title'; shop(); }
      if (a === 'options') options();
      if (a === 'credits') credits();
    });
  }

  /* =========================================================
     LOJA
     ========================================================= */
  function shop(returnTo) {
    current = 'shop';
    if (returnTo) shopReturn = returnTo;
    const d = BM.save.get();
    mount(`
      <div class="screen shop">
        <div class="shop-head">
          <div class="shop-brand">
            <span class="term-dot"></span>
            <h2>Terminal // Forja</h2>
            <span class="badge">LOJA</span>
          </div>
          <div class="shop-wallet">
            <div class="wallet"><span class="w-ico">◆</span><span id="w-scrap">${fmt(d.v1.scrap)}</span> <span class="dim">SUCATA</span></div>
            <div class="wallet core"><span class="w-ico">✷</span><span id="w-cores">${fmt(d.v1.cores)}</span> <span class="dim">NÚCLEOS</span></div>
            <button class="btn small" data-a="back">Voltar</button>
          </div>
        </div>
        <div class="tabs">
          <button class="tab on" data-tab="arms">Braços</button>
          <button class="tab" data-tab="legs">Pernas</button>
          <button class="tab" data-tab="chassis">Carcaças</button>
          <button class="tab" data-tab="items">Consumíveis</button>
        </div>
        <div class="shop-body">
          <div class="shop-layout">
            <div id="shop-grid" class="shop-grid"></div>
            <div class="shop-side" id="shop-side"></div>
          </div>
        </div>
        <div class="shop-foot">
          <span>TECLADO: 1-4 seleciona · ESC volta</span>
          <span class="dim">Dica: o peso das pernas e da carcaça altera o REFLEXO contra ataques imparáveis.</span>
        </div>
      </div>`);

    on('.tab', 'click', ev => {
      els('.tab').forEach(t => t.classList.remove('on'));
      ev.currentTarget.classList.add('on');
      BM.audio.play('select');
      renderShop(ev.currentTarget.getAttribute('data-tab'));
    });
    on('[data-a="back"]', 'click', () => {
      BM.audio.play('cancel');
      if (shopReturn === 'lobby') lobby(); else title();
    });
    renderShop('arms');
  }

  function renderShop(tab) {
    const d = BM.save.get();
    const grid = el('#shop-grid');
    const side = el('#shop-side');
    let html = '';

    if (tab === 'arms') {
      html = D.ARMS.map(a => {
        const owned = BM.save.ownedArm(a.id);
        const st = BM.save.unlockState('arm', a.id);
        const equipped = BM.save.equippedArms().indexOf(a.id) >= 0;
        return `
        <div class="card ${equipped ? 'equipped' : ''} ${owned ? '' : 'locked'}">
          <div class="card-art">${BM.sprites.v1(a.corHex)}
            ${owned ? '' : `<div class="lockveil">${esc(st.reason || 'BLOQUEADO')}</div>`}
          </div>
          <div class="card-body">
            <div class="card-name">${a.name}<span class="badge">${a.cor}</span></div>
            <div class="card-role">${a.role}</div>
            <div class="card-passive"><b>${a.passive.name}:</b> ${a.passive.desc}</div>
            <div class="card-moves">
              ${a.moves.map(mid => {
                const m = D.MOVES[mid];
                const t = m.type ? D.TYPES[m.type] : null;
                return `<div class="cm"><b>${m.name}</b> ${t ? '· ' + t.name : ''} ${m.power ? '· ' + m.power : ''} ${m.cd ? '· recarga ' + m.cd : ''} ${m.blood ? '· +' + m.blood + '% sangue' : ''}</div>`;
              }).join('')}
            </div>
            <div class="card-foot">
              ${owned ? `<span class="badge ok">ADQUIRIDO</span>`
                : `<span class="price ${st.ok ? '' : 'cant'}">${st.ok ? fmt(a.price) + ' ◆' : esc(st.reason)}</span>`}
              <div class="card-actions">
                ${owned ? (equipped ? '<span class="badge hot">EQUIPADO</span>'
                  : `<button class="btn small" data-equip-arm="${a.id}">Equipar</button>`)
                  : (st.ok ? `<button class="btn small primary" data-buy-arm="${a.id}">Comprar</button>` : '')}
              </div>
            </div>
          </div>
        </div>`;
      }).join('');
    } else if (tab === 'legs') {
      html = D.LEGS.map(l => {
        const owned = BM.save.ownedLeg(l.id);
        const st = BM.save.unlockState('leg', l.id);
        const eq = d.equip.legs === l.id;
        return `
        <div class="card ${eq ? 'equipped' : ''} ${owned ? '' : 'locked'}">
          <div class="card-art" style="font-size:2rem;color:${l.peso > 0 ? '#ff6b4a' : (l.peso < 0 ? '#3fd8d8' : '#8a7f78')}">${l.peso > 0 ? '◆' : (l.peso < 0 ? '◇' : '⬢')}</div>
          <div class="card-body">
            <div class="card-name">${l.name}${eq ? '<span class="badge hot">EQUIPADA</span>' : ''}</div>
            <div class="card-role">${l.desc}</div>
            <div class="card-stats">
              <span class="chip">Peso ${l.peso > 0 ? '+' + l.peso : l.peso}</span>
              <span class="chip">Vel ${Math.round(l.vel * 100)}%</span>
              <span class="chip">Esquiva ${Math.round(l.esquiva * 100)}%</span>
              <span class="chip">Fuga ${Math.round(l.fuga * 100)}%</span>
            </div>
            <div class="card-passive">${l.abilityDesc}</div>
            <div class="card-foot">
              ${owned ? '<span class="badge ok">ADQUIRIDO</span>' : `<span class="price ${st.ok ? '' : 'cant'}">${st.ok ? fmt(l.price) + ' ◆' : esc(st.reason)}</span>`}
              <div class="card-actions">
                ${owned ? (eq ? '' : `<button class="btn small" data-equip-leg="${l.id}">Equipar</button>`)
                  : (st.ok ? `<button class="btn small primary" data-buy-leg="${l.id}">Comprar</button>` : '')}
              </div>
            </div>
          </div>
        </div>`;
      }).join('');
    } else if (tab === 'chassis') {
      html = D.CHASSIS.map(c => {
        const owned = BM.save.ownedChassis(c.id);
        const st = BM.save.unlockState('chassis', c.id);
        const eq = d.equip.chassis === c.id;
        return `
        <div class="card ${eq ? 'equipped' : ''} ${owned ? '' : 'locked'}">
          <div class="card-art" style="font-size:2rem;color:${c.peso > 0 ? '#ff6b4a' : (c.peso < 0 ? '#3fd8d8' : '#8a7f78')}">${c.peso > 0 ? '▣' : (c.peso < 0 ? '▢' : '■')}</div>
          <div class="card-body">
            <div class="card-name">${c.name}${eq ? '<span class="badge hot">EQUIPADA</span>' : ''}</div>
            <div class="card-role">${c.desc}</div>
            <div class="card-stats">
              <span class="chip">Vida ${Math.round(c.hp * 100)}%</span>
              <span class="chip">Vel ${Math.round(c.vel * 100)}%</span>
              <span class="chip">Peso ${c.peso > 0 ? '+' + c.peso : c.peso}</span>
            </div>
            <div class="card-foot">
              ${owned ? '<span class="badge ok">ADQUIRIDO</span>' : `<span class="price ${st.ok ? '' : 'cant'}">${st.ok ? fmt(c.price) + ' ◆' : esc(st.reason)}</span>`}
              <div class="card-actions">
                ${owned ? (eq ? '' : `<button class="btn small" data-equip-chassis="${c.id}">Equipar</button>`)
                  : (st.ok ? `<button class="btn small primary" data-buy-chassis="${c.id}">Comprar</button>` : '')}
              </div>
            </div>
          </div>
        </div>`;
      }).join('');
    } else {
      html = D.ITEMS.map(i => {
        const st = BM.save.unlockState('item', i.id);
        const count = BM.save.itemCount(i.id);
        return `
        <div class="card ${st.ok ? '' : 'locked'}">
          <div class="card-art" style="font-size:1.6rem">${i.heal ? '✚' : (i.crit ? '◉' : (i.fixedDamage ? '✷' : (i.cureStatus ? '☗' : '⚒')))}</div>
          <div class="card-body">
            <div class="card-name">${i.name}</div>
            <div class="card-role">${i.desc}</div>
            <div class="card-stats"><span class="chip">ESTOQUE ${count}</span></div>
            <div class="card-foot">
              <span class="price ${st.ok ? '' : 'cant'}">${st.ok ? fmt(i.price) + ' ◆' : esc(st.reason)}</span>
              <div class="card-actions">${st.ok ? `<button class="btn small primary" data-buy-item="${i.id}">Comprar</button>` : ''}</div>
            </div>
          </div>
        </div>`;
      }).join('');
    }
    grid.innerHTML = html;
    renderShopSide();

    on('[data-buy-arm]', 'click', ev => doBuy('arm', ev.currentTarget.getAttribute('data-buy-arm')));
    on('[data-buy-leg]', 'click', ev => doBuy('leg', ev.currentTarget.getAttribute('data-buy-leg')));
    on('[data-buy-chassis]', 'click', ev => doBuy('chassis', ev.currentTarget.getAttribute('data-buy-chassis')));
    on('[data-buy-item]', 'click', ev => doBuy('item', ev.currentTarget.getAttribute('data-buy-item')));
    on('[data-equip-arm]', 'click', ev => {
      BM.audio.play('confirm');
      BM.main.openLoadout('shop');
    });
    on('[data-equip-leg]', 'click', ev => {
      BM.save.equipLeg(ev.currentTarget.getAttribute('data-equip-leg'));
      BM.audio.play('confirm'); renderShop(tab); toast('Pernas equipadas.', 'ok');
    });
    on('[data-equip-chassis]', 'click', ev => {
      BM.save.equipChassis(ev.currentTarget.getAttribute('data-equip-chassis'));
      BM.audio.play('confirm'); renderShop(tab); toast('Carcaça equipada.', 'ok');
    });
  }

  function doBuy(kind, id) {
    const r = BM.save.buy(kind, id);
    if (r.ok) {
      BM.audio.play('buy');
      toast('Comprado: ' + id, 'ok');
      renderShop(document.querySelector('.tab.on').getAttribute('data-tab'));
      BM.save.persist();
    } else {
      BM.audio.play('cancel');
      toast(r.msg, 'bad');
    }
  }

  function renderShopSide() {
    const side = el('#shop-side');
    if (!side) return;
    const st = BM.save.v1Stats();
    const d = BM.save.get();
    const arms = BM.save.equippedArms().map(id => D.ARMS.find(a => a.id === id)).filter(Boolean);
    const accent = arms.length ? arms[0].corHex : '#4aa8ff';
    side.innerHTML = `
      <div class="preview">
        <div class="preview-stage">${BM.sprites.v1(accent)}</div>
        <div class="title-sm">V1 — NÍVEL ${st.level}</div>
        <div class="preview-stats">
          <span>Integridade</span><b>${st.maxHp}</b>
          <span>Ataque</span><b>${st.atk}</b>
          <span>Defesa</span><b>${st.def}</b>
          <span>Velocidade</span><b>${st.vel}</b>
          <span>Peso</span><b>${st.peso > 0 ? '+' + st.peso : st.peso}</b>
          <span>Reflexo (imparável)</span><b>${Math.round(st.reflexo * 100)}%</b>
          <span>Esquiva</span><b>${Math.round(st.esquiva * 100)}%</b>
          <span>Fuga</span><b>${Math.round(st.fuga * 100)}%</b>
        </div>
        <div class="preview-arms">
          ${arms.length ? arms.map(a => `<span class="pa" style="border-color:${a.corHex};color:${a.corHex}">${a.name}</span>`).join('')
            : '<span class="pa">SEM BRAÇOS</span>'}
        </div>
        <div class="dim" style="font-size:.7rem">Perna: ${st.legs.name} · Carcaça: ${st.chassis.name}</div>
        <button class="btn small wide" data-a="loadout">Ajustar movimentos</button>
      </div>
      <div class="panel flat">
        <div class="panel-head"><span>Movimentos</span><span>${d.loadout.length}/4</span></div>
        ${d.loadout.map(mid => {
          const m = D.MOVES[mid];
          return m ? `<div class="list-item"><span>${m.name}</span></div>` : '';
        }).join('')}
        <div class="sep"></div>
        <div class="dim" style="font-size:.7rem">
          ${BM.save.hasPassive('parry') ? '<span class="s-ok">✓ PARRY ATIVO</span>' : '<span style="color:var(--warn)">✗ SEM PARRY</span>'}
          · ${BM.save.equippedArms().length}/4 braços
        </div>
      </div>`;
    on('[data-a="loadout"]', 'click', () => { BM.audio.play('select'); BM.main.openLoadout('shop'); });
  }

  /* =========================================================
     LOADOUT
     ========================================================= */
  function loadout(returnTo) {
    current = 'loadout';
    if (returnTo) loadoutReturn = returnTo;
    const d = BM.save.get();
    const arms = BM.save.availableArms();
    mount(`
      <div class="screen" style="overflow:auto">
        <div class="hub-top">
          <div class="hub-brand">LOADOUT</div>
          <div class="hub-stats">
            <span class="badge">MOVIMENTOS <b id="lo-moves">0</b>/4</span>
            <span class="badge">BRAÇOS <b id="lo-arms">0</b>/4</span>
            <span class="badge" id="lo-parry">PARRY</span>
            <button class="btn small" data-a="back">Voltar</button>
          </div>
        </div>
        <div style="padding:16px;max-width:1180px;margin:0 auto;width:100%">
          <div class="slot-summary" id="lo-summary"></div>
          <div class="loadout-grid">
            ${arms.map(a => `
              <div class="arm-col" data-arm="${a.id}">
                <div class="arm-head">
                  <span class="arm-swatch" style="background:${a.corHex};color:${a.corHex}"></span>
                  <span class="arm-name">${a.name}</span>
                </div>
                <div class="arm-passive"><b>${a.passive.name}:</b> ${a.passive.desc}</div>
                ${a.moves.map(mid => {
                  const m = D.MOVES[mid];
                  const t = m.type ? D.TYPES[m.type] : null;
                  return `<button class="move-pick" data-move="${mid}">
                    <span class="mv-type" style="background:${t ? t.color : '#555'};color:${t ? t.color : '#555'}"></span>
                    <span class="mv-name">${m.name}</span>
                    <span class="mv-meta">${m.power ? m.power : '—'}${m.cd ? ' · r' + m.cd : ''}${m.blood ? ' · +' + m.blood + '%' : ''}</span>
                    <span class="tick">✦</span>
                  </button>`;
                }).join('')}
              </div>`).join('')}
          </div>
          <div class="dim" style="margin-top:14px;font-size:.72rem">
            Escolha até 4 movimentos. Cada braço diferente entre eles conta como um braço equipado e ativa a passiva dele.
            O Feedbacker entre os 4 é o que libera o parry.
          </div>
        </div>
      </div>`);

    on('[data-move]', 'click', ev => {
      const id = ev.currentTarget.getAttribute('data-move');
      const d2 = BM.save.get();
      if (d2.loadout.indexOf(id) >= 0) { BM.save.toggleMove(id); BM.audio.play('select'); }
      else if (d2.loadout.length >= 4) { BM.audio.play('cancel'); toast('Máximo de 4 movimentos.', 'bad'); return; }
      else { BM.save.toggleMove(id); BM.audio.play('confirm'); }
      refreshLoadout();
    });
    on('[data-a="back"]', 'click', () => {
      BM.audio.play('cancel');
      if (loadoutReturn === 'shop') shop('shop'); else lobby();
    });
    refreshLoadout();
  }

  function refreshLoadout() {
    const d = BM.save.get();
    els('.move-pick').forEach(n => {
      const on = d.loadout.indexOf(n.getAttribute('data-move')) >= 0;
      n.classList.toggle('picked', on);
    });
    const arms = BM.save.equippedArms();
    const mv = el('#lo-moves'); if (mv) mv.textContent = d.loadout.length;
    const ar = el('#lo-arms'); if (ar) ar.textContent = arms.length;
    const pr = el('#lo-parry');
    if (pr) {
      const has = BM.save.hasPassive('parry');
      pr.textContent = has ? 'PARRY ATIVO' : 'SEM PARRY';
      pr.className = 'badge ' + (has ? 'ok' : 'warn');
    }
    const sum = el('#lo-summary');
    if (sum) {
      sum.innerHTML = d.loadout.map(mid => {
        const m = D.MOVES[mid];
        const t = m.type ? D.TYPES[m.type] : null;
        return `<span class="chip" style="border-color:${t ? t.color : '#555'};color:${t ? t.color : '#999'}">${m.name}</span>`;
      }).join('') + `<span class="dim" style="font-size:.72rem">Braços: ${arms.map(a => (D.ARMS.find(x => x.id === a) || {}).name).join(' + ')}</span>`;
    }
  }

  /* =========================================================
     LOBBY / OFICINA
     ========================================================= */
  function lobby() {
    current = 'lobby';
    const d = BM.save.get();
    const st = BM.save.v1Stats();
    const unlocked = d.progress.unlockedLayers;
    mount(`
      <div class="screen hub">
        <div class="hub-top">
          <div class="hub-brand">BLOODMACH</div>
          <div class="hub-stats">
            <span class="badge">NV <b>${st.level}</b></span>
            <span class="badge">${fmt(d.v1.scrap)} ◆ SUCATA</span>
            <span class="badge">${fmt(d.v1.cores)} ✷ NÚCLEOS</span>
            <span class="badge ${d.flags.v2Dead ? 'ok' : 'hot'}">${d.flags.v2Dead ? 'V2 MORTO' : 'V2 VIVO'}</span>
          </div>
        </div>
        <div class="hub-main">
          <div class="stack">
            <div class="terminal">
              <div class="term-head"><span class="term-dot"></span><h3>Terminal da Forja</h3></div>
              <div class="term-line">&gt; V1 operacional. Combustível: sangue.</div>
              <div class="term-line">&gt; Use o terminal para comprar peças e ajustar o build.</div>
              <div class="row wrap" style="margin-top:10px">
                <button class="btn small primary" data-a="shop">Abrir Loja</button>
                <button class="btn small" data-a="loadout">Ajustar Movimentos</button>
                <button class="btn small" data-a="options">Opções</button>
                <button class="btn small danger" data-a="wipe">Apagar Save</button>
              </div>
            </div>
            <div>
              <div class="section-title">Camadas</div>
              <div class="grid2">
                ${D.LAYERS.map((L, i) => {
                  const locked = i >= unlocked;
                  return `<div class="layer-card ${locked ? 'locked' : ''}">
                    <div class="row" style="justify-content:space-between">
                      <div class="title-sm">Camada ${L.roman}</div>
                      <div class="badge ${locked ? '' : 'hot'}">${locked ? 'BLOQUEADA' : 'ABERTA'}</div>
                    </div>
                    <h3>${L.name}</h3>
                    <div class="layer-art">${BM.sprites.layerArt(L.id)}</div>
                    <div class="layer-info">${L.subtitle} — ${L.desc}</div>
                    <div class="layer-mod">◈ ${L.modifier.name}: ${L.modifier.desc}</div>
                    <div class="layer-info dim">Chefe: ${D.ENEMIES[L.boss].name} · ${L.encounters.length} encontros</div>
                    <button class="btn small wide ${locked ? '' : 'primary'}" data-layer="${i}" ${locked ? 'disabled' : ''}>
                      ${locked ? 'Derrote o chefe anterior' : 'Entrar na camada'}
                    </button>
                  </div>`;
                }).join('')}
              </div>
            </div>
          </div>
          <div class="hub-side">
            <div class="panel">
              <div class="panel-head"><span>V1</span><span>NÍVEL ${st.level}</span></div>
              <div class="preview-stage" style="height:180px">${BM.sprites.v1('#d81f3a')}</div>
              <div class="preview-stats" style="margin-top:8px">
                <span>Integridade</span><b>${st.maxHp}</b>
                <span>Ataque</span><b>${st.atk}</b>
                <span>Defesa</span><b>${st.def}</b>
                <span>Velocidade</span><b>${st.vel}</b>
                <span>Peso</span><b>${st.peso > 0 ? '+' + st.peso : st.peso}</b>
                <span>Reflexo</span><b>${Math.round(st.reflexo * 100)}%</b>
                <span>Esquiva / Fuga</span><b>${Math.round(st.esquiva * 100)}% / ${Math.round(st.fuga * 100)}%</b>
                <span>Perna</span><b>${st.legs.name}</b>
                <span>Carcaça</span><b>${st.chassis.name}</b>
              </div>
            </div>
            <div class="panel flat">
              <div class="panel-head"><span>Mochila</span></div>
              ${Object.keys(d.items).filter(k => d.items[k] > 0).map(k => {
                const it = D.ITEMS.find(x => x.id === k);
                return it ? `<div class="list-item"><span>${it.name}</span><span class="dim">×${d.items[k]}</span></div>` : '';
              }).join('') || '<div class="dim">Vazia.</div>'}
            </div>
            <div class="panel flat">
              <div class="panel-head"><span>Registro</span></div>
              <div class="preview-stats">
                <span>Batalhas</span><b>${d.stats.batalhas}</b>
                <span>Vitórias</span><b>${d.stats.vitorias}</b>
                <span>Mortes</span><b>${d.stats.mortes}</b>
                <span>Estilo máx.</span><b>${d.stats.estiloMax}</b>
                <span>Parries</span><b>${d.stats.parries}</b>
              </div>
            </div>
          </div>
        </div>
        <div class="hub-foot">
          <span class="dim">Dica: legs pesadas aumentam HP efetivo mas reduzem o Reflexo contra ataques imparáveis.</span>
          <button class="btn small" data-a="title">Título</button>
        </div>
      </div>`);

    on('[data-a="shop"]', 'click', () => { BM.audio.play('select'); shop('lobby'); });
    on('[data-a="loadout"]', 'click', () => { BM.audio.play('select'); BM.main.openLoadout('lobby'); });
    on('[data-a="options"]', 'click', () => { BM.audio.play('select'); options(); });
    on('[data-a="wipe"]', 'click', () => {
      if (confirm('Apagar todo o progresso? Isso não pode ser desfeito.')) { BM.save.wipe(); BM.audio.play('cancel'); title(); }
    });
    on('[data-a="title"]', 'click', () => { BM.audio.play('cancel'); title(); });
    on('[data-layer]', 'click', ev => BM.main.startLayer(parseInt(ev.currentTarget.getAttribute('data-layer'), 10)));
  }

  /* =========================================================
     MAPA DA CAMADA
     ========================================================= */
  function layerMap(layerIndex) {
    current = 'map';
    const L = D.LAYERS[layerIndex];
    const d = BM.save.get();
    const node = d.progress.node;
    const isBoss = node >= L.encounters.length;
    const enemyId = isBoss ? L.boss : L.encounters[node];
    const en = D.ENEMIES[enemyId];
    const cp = L.checkpoints.indexOf(node) >= 0;
    mount(`
      <div class="screen" style="overflow:auto">
        <div class="hub-top">
          <div class="hub-brand">CAMADA ${L.roman} — ${L.name.toUpperCase()}</div>
          <div class="hub-stats">
            <span class="badge">${L.subtitle}</span>
            <span class="badge warn">◈ ${L.modifier.name}</span>
            <button class="btn small" data-a="lobby">Oficina</button>
          </div>
        </div>
        <div style="padding:16px;max-width:900px;margin:0 auto;width:100%">
          <div class="panel">
            <div class="panel-head"><span>Progresso</span><span>${node}/${L.encounters.length} + chefe</span></div>
            <div class="node-list">
              ${L.encounters.map((eid, i) => {
                const e = D.ENEMIES[eid];
                const done = i < node;
                const now = i === node;
                return `<button class="node ${done ? 'done' : ''} ${now ? '' : ''}" data-node="${i}" ${now ? '' : 'disabled'}>
                  <span class="node-i">${done ? '✓' : i + 1}</span>
                  <span class="grow">${e.name}</span>
                  <span class="dim">${D.FACTIONS[e.faction].name}</span>
                </button>`;
              }).join('')}
              <button class="node boss" data-node="${L.encounters.length}" ${isBoss ? '' : 'disabled'}>
                <span class="node-i">☠</span>
                <span class="grow">${D.ENEMIES[L.boss].name}</span>
                <span class="dim">CHEFE</span>
              </button>
            </div>
            ${cp ? '<div class="badge ok" style="margin-top:10px">CHECKPOINT — integridade restaurada parcialmente</div>' : ''}
          </div>
          <div class="panel flat" style="margin-top:12px">
            <div class="panel-head"><span>Próximo</span><span>${en.faction ? D.FACTIONS[en.faction].name : ''}</span></div>
            <div class="row" style="justify-content:space-between;align-items:flex-start;gap:12px">
              <div>
                <div class="title-lg">${en.name}</div>
                <div class="dim" style="font-size:.78rem">Integridade ${en.hp} · Ataque ${en.atk} · Defesa ${en.def}${en.boss ? ' · CHEFE' : ''}</div>
                <div class="dim" style="font-size:.72rem">Fraquezas: ${D.FACTIONS[en.faction].weak.join(', ')} · Resiste a: ${D.FACTIONS[en.faction].resist.join(', ')}</div>
              </div>
              <button class="btn primary" data-a="fight">${isBoss ? 'ENFRENTAR CHEFE' : 'LUTAR'}</button>
            </div>
          </div>
        </div>
      </div>`);
    on('[data-a="lobby"]', 'click', () => { BM.audio.play('cancel'); lobby(); });
    on('[data-a="fight"]', 'click', () => BM.main.startBattle(enemyId, layerIndex));
  }

  /* =========================================================
     DIÁLOGO
     ========================================================= */
  function dialogue(lines, onDone) {
    const box = document.createElement('div');
    box.className = 'dialogue';
    box.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-portraits" id="dl-portraits"></div>
        <div class="dialogue-who" id="dl-who">—</div>
        <div class="dialogue-text" id="dl-text"></div>
        <div class="dialogue-foot">
          <span>CLIQUE / ESPAÇO PARA AVANÇAR</span>
          <span id="dl-i"></span>
        </div>
      </div>`;
    document.body.appendChild(box);
    let i = 0, typing = false, full = '';
    const who = box.querySelector('#dl-who');
    const textEl = box.querySelector('#dl-text');
    const idx = box.querySelector('#dl-i');
    const port = box.querySelector('#dl-portraits');

    function showPortrait(line) {
      if (!line.portrait) { port.innerHTML = ''; return; }
      const svg = BM.sprites.portrait(line.portrait);
      if (!svg) { port.innerHTML = ''; return; }
      port.innerHTML = `<div class="por">${svg}</div>`;
    }
    function typeOut() {
      const line = lines[i];
      who.textContent = line.who || '—';
      showPortrait(line);
      full = line.text;
      textEl.textContent = '';
      typing = true;
      let k = 0;
      const fast = BM.save.get().settings.textoRápido;
      const step = fast ? 1 : 2;
      const iv = setInterval(() => {
        k += step;
        textEl.innerHTML = esc(full.slice(0, k)) + (k < full.length ? '<span class="caret">▌</span>' : '');
        if (k >= full.length) { clearInterval(iv); typing = false; }
      }, fast ? 8 : 16);
    }
    function advance() {
      if (typing) {
        const line = lines[i];
        textEl.innerHTML = esc(line.text);
        typing = false;
        return;
      }
      i++;
      if (i >= lines.length) {
        box.remove();
        if (onDone) onDone();
        return;
      }
      idx.textContent = (i + 1) + '/' + lines.length;
      BM.audio.play('select');
      typeOut();
    }
    box.addEventListener('click', advance);
    const keyHandler = ev => {
      if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); advance(); }
    };
    document.addEventListener('keydown', keyHandler);
    const obs = new MutationObserver(() => {
      if (!document.body.contains(box)) { document.removeEventListener('keydown', keyHandler); obs.disconnect(); }
    });
    obs.observe(document.body, { childList: true });
    idx.textContent = '1/' + lines.length;
    typeOut();
  }

  /* =========================================================
     BATALHA
     ========================================================= */
  function battle() {
    current = 'battle';
    battleKeys();
    const S = BM.battle.state;
    const layer = S.layer;
    const arms = BM.save.equippedArms().map(id => D.ARMS.find(a => a.id === id)).filter(Boolean);
    const accent = arms.length ? arms[0].corHex : '#4aa8ff';
    mount(`
      <div class="screen battle" id="battle-root">
        <div class="arena" id="arena">
          <div class="arena-bg">${BM.sprites.arena(layer.theme)}</div>
          <div class="arena-floor"></div>
          <div class="fighter player" id="f-player">
            <div class="f-sprite">${BM.sprites.v1(accent)}</div>
            <div class="f-panel">
              <div class="f-name">V1 <span class="f-lv">NV ${S.player.level}</span></div>
              <div class="bar"><i id="hp-p"></i><span id="hp-t"></span></div>
              <div class="status-row" id="st-p"></div>
            </div>
          </div>
          <div class="fighter enemy" id="f-enemy">
            <div class="f-sprite">${BM.sprites.get(S.enemy.sprite)}</div>
            <div class="f-panel">
              <div class="f-name">${S.enemy.name} <span class="f-lv">${S.enemy.isBoss ? 'CHEFE' : ''}</span></div>
              <div class="bar"><i id="hp-e"></i><span id="hp-t-e"></span></div>
              <div class="status-row" id="st-e"></div>
            </div>
          </div>
          <div class="b-center">
            <div class="intent" id="intent"></div>
            <div class="dist-badge" id="dist"></div>
          </div>
          <div class="style-meter"><i id="style-fill"></i></div>
          <div class="style-rank" id="style-rank">D</div>
          <div class="turn-flash" id="turn-flash"></div>
        </div>
        <div class="b-log" id="blog"></div>
        <div class="b-controls">
          <div class="moves" id="moves"></div>
          <div class="aux" id="aux"></div>
        </div>
        <div class="parry-layer" id="parry-layer">
          <div class="parry-box">
            <div class="parry-title">PARRY</div>
            <div class="parry-track" id="parry-track">
              <div class="parry-good left" id="parry-good-l"></div>
              <div class="parry-good right" id="parry-good-r"></div>
              <div class="parry-perfect" id="parry-perfect"></div>
              <div class="parry-marker" id="parry-marker"></div>
            </div>
            <div class="parry-hint">ESPAÇO / CLIQUE NO MOMENTO CERTO</div>
            <div class="parry-result" id="parry-result"></div>
          </div>
        </div>
      </div>`);
    battleUpdate();
    (BM.battle.state.log || []).slice(-3).forEach(l => battleLog(l.msg, l.cls));
    on('#moves .mv', 'click', ev => {
      const id = ev.currentTarget.getAttribute('data-move');
      if (ev.currentTarget.disabled) return;
      BM.audio.play('select');
      BM.battle.runTurn({ type:'move', id });
    });
    on('#aux [data-a]', 'click', ev => {
      const a = ev.currentTarget.getAttribute('data-a');
      if (a === 'item') openItemMenu();
      else if (a === 'flee') BM.battle.runTurn({ type:'flee' });
      else if (a === 'dash') BM.battle.runTurn({ type:'dash' });
      else if (a === 'arranque') BM.battle.runTurn({ type:'arranque' });
    });
  }

  function battleKeys() {
    if (battleKeys.on) return;
    battleKeys.on = true;
    document.addEventListener('keydown', function (ev) {
      if (BM.ui.current !== 'battle') return;
      const S = BM.battle.state;
      if (!S || S.busy || S.over) return;
      if (ev.key === '1' || ev.key === '2' || ev.key === '3' || ev.key === '4') {
        const idx = parseInt(ev.key, 10) - 1;
        const mv = BM.save.get().loadout[idx];
        if (!mv) return;
        const btn = document.querySelector('#moves .mv[data-move="' + mv + '"]');
        if (btn && !btn.disabled) { ev.preventDefault(); BM.audio.play('select'); BM.battle.runTurn({ type: 'move', id: mv }); }
      }
    });
  }

  function battleUpdate() {
    const S = BM.battle.state;
    if (!S || current !== 'battle') return;
    const busy = S.busy;
    // HP
    const hpP = el('#hp-p'), hpPt = el('#hp-t');
    if (hpP) {
      hpP.style.width = Math.max(0, S.player.hp / S.player.maxHp * 100) + '%';
      hpPt.textContent = S.player.hp + ' / ' + S.player.maxHp;
    }
    const hpE = el('#hp-e'), hpEt = el('#hp-t-e');
    if (hpE) {
      hpE.style.width = Math.max(0, S.enemy.hp / S.enemy.maxHp * 100) + '%';
      hpEt.textContent = S.enemy.hp + ' / ' + S.enemy.maxHp;
    }
    // status
    const stP = el('#st-p'), stE = el('#st-e');
    if (stP) stP.innerHTML = statusChips(S.player);
    if (stE) stE.innerHTML = statusChips(S.enemy);
    // intenção
    const it = el('#intent');
    if (it && S.enemy.intent) {
      const m = S.enemy.intent;
      const cls = m.unavoidable ? 'inevitable' : (m.parryable === false ? 'unparryable' : 'parryable');
      const ico = m.unavoidable ? '☠' : (m.parryable === false ? '✷' : (m.kind === 'ranged' ? '✦' : '⚔'));
      it.className = 'intent ' + cls;
      it.innerHTML = `<span class="ico">${ico}</span><span>${S.enemy.name} ${m.text || ''}</span><span class="dim">${m.unavoidable ? 'INEVITÁVEL' : (m.parryable === false ? 'IMPARÁVEL' : 'PARÁVEL')}</span>`;
    }
    // distância
    const db = el('#dist');
    if (db) {
      const d = S.dist;
      db.innerHTML = 'DISTÂNCIA: <span class="' + (d === 2 ? 'd-perto' : (d === 0 ? 'd-longe' : 'd-medio')) + '">' +
        (d === 2 ? 'PERTO' : (d === 0 ? 'LONGE' : 'MÉDIO')) + '</span>';
    }
    // estilo
    const sf = el('#style-fill'), sr = el('#style-rank');
    if (sf) {
      const max = 2400;
      sf.style.height = Math.min(100, S.style.points / max * 100) + '%';
      sr.textContent = S.style.rank.key;
      sr.style.color = S.style.rank.color;
    }
    // movimentos
    const mv = el('#moves');
    if (mv) {
      mv.innerHTML = BM.save.loadoutMoves().map(m => {
        const cd = S.player.cooldowns[m.id] || 0;
        const t = m.type ? D.TYPES[m.type] : null;
        const desc = [];
        if (m.power) desc.push('POD ' + m.power);
        if (m.hits) desc.push(m.hits + '×');
        if (m.blood) desc.push('+' + m.blood + '% SANGUE');
        if (m.cd) desc.push('REC ' + m.cd);
        return `<button class="mv ${S.player.charge === m.id ? 'charged' : ''}" data-move="${m.id}"
          style="--tcolor:${t ? t.color : '#8a7f78'}" ${busy || cd > 0 ? 'disabled' : ''}>
          ${cd > 0 ? `<div class="cd-overlay">${cd}</div>` : ''}
          <div class="mv-top"><span class="mv-name">${m.name}</span><span class="mv-type">${t ? t.icon + ' ' + t.name : 'UTIL'}</span></div>
          <div class="mv-foot">${desc.map(x => '<span>' + x + '</span>').join('')}</div>
        </button>`;
      }).join('');
      els('#moves .mv').forEach(n => n.addEventListener('click', ev => {
        if (ev.currentTarget.disabled) return;
        BM.audio.play('select');
        BM.battle.runTurn({ type:'move', id: n.getAttribute('data-move') });
      }));
    }
    // aux
    const aux = el('#aux');
    if (aux) {
      const items = Object.keys(BM.save.get().items).filter(k => BM.save.get().items[k] > 0);
      const ability = S.player.legs ? S.player.legs.ability : null;
      aux.innerHTML = `
        <button class="btn small" data-a="item" ${busy ? 'disabled' : ''}>Item (${items.length})</button>
        ${ability === 'dash' ? `<button class="btn small" data-a="dash" ${busy || S.player.dashUsed ? 'disabled' : ''}>Dash</button>` : ''}
        ${ability === 'arranque' ? `<button class="btn small" data-a="arranque" ${busy || S.player.arranqueUsed ? 'disabled' : ''}>Arrancar</button>` : ''}
        <button class="btn small" data-a="flee" ${busy || S.isBoss ? 'disabled' : ''}>Fugir</button>`;
      els('#aux [data-a]').forEach(n => n.addEventListener('click', ev => {
        const a = n.getAttribute('data-a');
        if (a === 'item') openItemMenu();
        else if (a === 'flee') BM.battle.runTurn({ type:'flee' });
        else if (a === 'dash') { BM.battle.runTurn({ type:'dash' }); }
        else if (a === 'arranque') { BM.battle.runTurn({ type:'arranque' }); }
      }));
    }
  }

  function statusChips(e) {
    const st = e.status || {};
    const map = {
      sangramento: ['Sangramento', 'sangramento'], derretido: ['Derretido', 'derretido'],
      ferrugem: ['Ferrugem', 'ferrugem'], coagulo: ['Coágulo', 'coagulo'],
      atordoado: ['Atordoado', 'atordoado'], exposto: ['Exposto', 'exposto'],
      postura: ['Postura', 'postura'], ligado: ['Preso', 'ferrugem']
    };
    let out = Object.keys(st).filter(k => map[k]).map(k =>
      `<span class="st ${map[k][1]}">${map[k][0]}</span>`).join('');
    if (e.velBoost > 0) out += '<span class="st postura">Arranque</span>';
    return out;
  }

  function battleLog(msg, cls) {
    const box = el('#blog');
    if (!box) return;
    const d = document.createElement('div');
    if (cls) d.className = cls;
    d.textContent = msg;
    box.appendChild(d);
    while (box.children.length > 4) box.removeChild(box.firstChild);
  }

  function floatText(text, side, kind) {
    const root = el('#battle-root');
    if (!root) return;
    const f = document.createElement('div');
    f.className = 'dmg ' + (side || '') + ' ' + (kind || '');
    f.textContent = text;
    const x = side === 'player' ? 25 : 75;
    f.style.left = x + '%';
    f.style.top = (28 + Math.random() * 18) + '%';
    root.appendChild(f);
    setTimeout(() => f.remove(), 1000);
  }

  function shake(k) {
    if (!BM.save.get().settings.tremor) return;
    const root = el('#battle-root');
    if (!root) return;
    const cls = 'shake-' + (k || 1);
    root.classList.remove('shake-1', 'shake-2', 'shake-3');
    void root.offsetWidth;
    root.classList.add(cls);
    setTimeout(() => root.classList.remove(cls), 500);
  }

  function flashTurn() {
    const f = el('#turn-flash');
    if (!f) return;
    f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
  }

  /* ---------------- PARRY ---------------- */
  function promptParry(cfg) {
    return new Promise(resolve => {
      const layer = el('#parry-layer');
      const track = el('#parry-track');
      const marker = el('#parry-marker');
      const goodL = el('#parry-good-l');
      const goodR = el('#parry-good-r');
      const perfect = el('#parry-perfect');
      const result = el('#parry-result');
      if (!layer || !track) { resolve('miss'); return; }
      const pw = cfg.perfect * 100, gw = cfg.good * 100;
      perfect.style.left = ((100 - pw) / 2) + '%';
      perfect.style.width = pw + '%';
      goodL.style.left = ((100 - pw) / 2 - gw) + '%';
      goodL.style.width = gw + '%';
      goodR.style.left = ((100 + pw) / 2) + '%';
      goodR.style.width = gw + '%';
      result.textContent = '';
      layer.classList.add('on');
      const W = track.clientWidth;
      let pos = rand(W * 0.1, W * 0.4), dir = 1, last = null, done = false;
      const speed = W / (cfg.ms / 1000);
      // loop temporal (independe de framerate e funciona em qualquer navegador)
      const timer = setInterval(function () {
        if (done) return;
        const ts = performance.now();
        if (last == null) last = ts;
        const dt = (ts - last) / 1000; last = ts;
        pos += dir * speed * dt;
        if (pos > W) { pos = W; dir = -1; }
        if (pos < 0) { pos = 0; dir = 1; }
        marker.style.left = pos + 'px';
      }, 16);
      const timeout = setTimeout(() => finish('miss'), cfg.ms * 2.6);
      function finish(res) {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        clearInterval(timer);
        result.className = 'parry-result ' + res;
        result.textContent = res === 'perfect' ? 'PERFEITO!' : (res === 'good' ? 'BOM' : 'FALHOU');
        BM.audio.play(res === 'miss' ? 'parryMiss' : 'parry');
        setTimeout(() => {
          layer.classList.remove('on');
          resolve(res);
        }, res === 'perfect' ? 420 : 260);
      }
      function press() {
        const pct = pos / W;            // 0..1
        const off = Math.abs(pct - 0.5);
        if (off <= (pw / 2) / 100) finish('perfect');
        else if (off <= (pw / 2 + gw) / 100) finish('good');
        else finish('miss');
      }
      const keyHandler = ev => {
        if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); press(); }
      };
      document.addEventListener('keydown', keyHandler);
      const trackHandler = () => press();
      track.addEventListener('pointerdown', trackHandler);
      const cleanup = () => {
        document.removeEventListener('keydown', keyHandler);
        track.removeEventListener('pointerdown', trackHandler);
      };
      const obs = new MutationObserver(() => { if (!layer.classList.contains('on')) { cleanup(); obs.disconnect(); } });
      obs.observe(layer, { attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ---------------- menu de itens ---------------- */
  function openItemMenu() {
    const d = BM.save.get();
    const list = Object.keys(d.items).filter(k => d.items[k] > 0);
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div class="panel modal-card">
      <div class="panel-head"><span>Mochila</span><span>${list.length} itens</span></div>
      <div class="list">
        ${list.length ? list.map(k => {
          const it = D.ITEMS.find(x => x.id === k);
          return `<button class="list-item" data-use="${k}"><span>${it.name} <span class="dim">×${d.items[k]}</span></span><span class="dim" style="font-size:.68rem">${it.desc}</span></button>`;
        }).join('') : '<div class="dim">Mochila vazia.</div>'}
      </div>
      <div class="modal-actions"><button class="btn small" data-a="close">Fechar</button></div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', ev => {
      const use = ev.target.getAttribute && ev.target.getAttribute('data-use');
      if (use) { m.remove(); BM.battle.runTurn({ type:'item', id: use }); }
      else if (ev.target.getAttribute('data-a') === 'close' || ev.target === m) m.remove();
    });
  }

  /* =========================================================
     RESULTADO
     ========================================================= */
  function result(info) {
    current = 'result';
    const d = BM.save.get();
    const win = info.result === 'win';
    const rank = info.rank || D.STYLE_RANKS[0];
    mount(`
      <div class="screen result">
        <div class="panel result-card">
          <div class="title-sm">${win ? 'VITÓRIA' : (info.result === 'fled' ? 'FUGA' : 'SISTEMA CRÍTICO')}</div>
          ${win ? `<div class="rank-badge ${rank.key === 'SSS' ? 'sss' : ''}">${rank.key}</div>` : ''}
          <div class="result-lines">
            ${win ? `
              <div class="rline"><span>Inimigo</span><span>${info.enemyName}</span></div>
              <div class="rline"><span>Estilo</span><span>${info.stylePoints} pts</span></div>
              <div class="rline"><span>Multiplicador</span><span>×${rank.mult.toFixed(2)}</span></div>
              <div class="rline"><span>Sucata</span><span>+${fmt(info.scrap)}</span></div>
              <div class="rline"><span>Experiência</span><span>+${fmt(info.xp)}</span></div>
              ${info.levels && info.levels.length ? `<div class="rline"><span style="color:var(--brass)">NÍVEL ${info.levels[info.levels.length - 1]}</span><span style="color:var(--brass)">NÍVEL ${info.levels[info.levels.length - 1]}!</span></div>` : ''}
            ` : (info.result === 'fled'
              ? `<div class="rline"><span>Você fugiu da batalha.</span><span></span></div>`
              : `<div class="rline"><span>Integridade</span><span>0</span></div>
                 <div class="rline"><span>Sucata perdida</span><span>-${fmt(info.lost || 0)}</span></div>`)}
          </div>
          <div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap">
            ${info.result === 'lose' && BM.save.itemCount('kit_reparo') > 0 ? '<button class="btn" data-a="kit">Usar Kit de Reparo</button>' : ''}
            <button class="btn primary" data-a="cont">Continuar</button>
          </div>
        </div>
      </div>`);
    on('[data-a="cont"]', 'click', ev => {
      if (ev.currentTarget.disabled) return;
      ev.currentTarget.disabled = true;
      BM.audio.play('confirm');
      BM.main.afterBattle(info);
    });
    on('[data-a="kit"]', 'click', () => { BM.audio.play('heal'); BM.main.useRepairKit(); });
  }

  /* =========================================================
     OPÇÕES
     ========================================================= */
  function options() {
    current = 'options';
    const s = BM.save.get().settings;
    mount(`
      <div class="screen options">
        <div class="panel options-card">
          <div class="panel-head"><span>Opções</span><span>BLOODMACH</span></div>
          <div class="opt-row">
            <label>Dificuldade<span class="hint">Ajusta a velocidade da barra de parry e o dano recebido.</span></label>
            <select id="opt-diff">
              ${Object.keys(D.DIFFICULTIES).map(k => `<option value="${k}" ${s.dificuldade === k ? 'selected' : ''}>${D.DIFFICULTIES[k].name}</option>`).join('')}
            </select>
          </div>
          <div class="opt-row">
            <label>Efeitos sonoros<span class="hint">Impactos, parry, metal.</span></label>
            <div class="switch ${s.som ? 'on' : ''}" id="opt-som"><i></i></div>
          </div>
          <div class="opt-row">
            <label>Volume<span class="hint">${Math.round(s.volume * 100)}%</span></label>
            <input type="range" id="opt-vol" min="0" max="100" value="${Math.round(s.volume * 100)}">
          </div>
          <div class="opt-row">
            <label>Música / ambiente<span class="hint">${Math.round(s.musica * 100)}%</span></label>
            <input type="range" id="opt-mus" min="0" max="100" value="${Math.round(s.musica * 100)}">
          </div>
          <div class="opt-row">
            <label>Tremor de tela<span class="hint">Impactos na arena.</span></label>
            <div class="switch ${s.tremor ? 'on' : ''}" id="opt-tremor"><i></i></div>
          </div>
          <div class="opt-row">
            <label>Assistência de parry<span class="hint">Barra mais lenta e janela maior.</span></label>
            <div class="switch ${s.parryAssist ? 'on' : ''}" id="opt-assist"><i></i></div>
          </div>
          <div class="opt-row">
            <label>Texto rápido<span class="hint">Acelera os diálogos.</span></label>
            <div class="switch ${s.textoRápido ? 'on' : ''}" id="opt-texto"><i></i></div>
          </div>
          <div class="modal-actions"><button class="btn" data-a="back">Voltar</button></div>
        </div>
      </div>`);
    function bindSwitch(id, key) {
      const n = el(id);
      n.addEventListener('click', () => {
        const v = !n.classList.contains('on');
        n.classList.toggle('on', v);
        BM.save.setSetting(key, v);
        BM.save.applySettings();
        BM.audio.play('select');
      });
    }
    bindSwitch('#opt-som', 'som');
    bindSwitch('#opt-tremor', 'tremor');
    bindSwitch('#opt-assist', 'parryAssist');
    bindSwitch('#opt-texto', 'textoRápido');
    el('#opt-diff').addEventListener('change', ev => {
      BM.save.setSetting('dificuldade', ev.target.value);
      BM.audio.play('select');
      toast('Dificuldade: ' + D.DIFFICULTIES[ev.target.value].name, 'ok');
    });
    el('#opt-vol').addEventListener('input', ev => {
      const v = ev.target.value / 100;
      BM.save.setSetting('volume', v); BM.save.applySettings();
    });
    el('#opt-mus').addEventListener('input', ev => {
      const v = ev.target.value / 100;
      BM.save.setSetting('musica', v); BM.save.applySettings();
    });
    on('[data-a="back"]', 'click', () => { BM.audio.play('cancel'); BM.main.backFromOptions(); });
  }

  /* =========================================================
     CRÉDITOS / FINAL
     ========================================================= */
  function credits() {
    current = 'credits';
    mount(`
      <div class="screen credits">
        <div class="credits-inner">
          <h2>BLOODMACH</h2>
          <div class="credit-line">GLUTTONY // HERESY</div>
          <div class="sep"></div>
          <p>Jogo de batalhas por turnos inspirado em Ultrakill e Pokémon.</p>
          <p>V1 • V2 • Gabriel — nomes e personagens de Ultrakill, de <b>Arsenic Games</b>.</p>
          <p>Projeto de fã, sem fins lucrativos. Toda a arte é vetorial gerada em código; todos os sons são sintetizados em tempo real.</p>
          <div class="sep"></div>
          <p class="dim">Feito em HTML, CSS e JavaScript puro. Sem dependências, sem build, sem armas.</p>
          <div class="row" style="justify-content:center;margin-top:14px">
            <button class="btn" data-a="back">Voltar</button>
          </div>
        </div>
      </div>`);
    on('[data-a="back"]', 'click', () => { BM.audio.play('cancel'); BM.main.backFromOptions(); });
  }

  function ending() {
    current = 'ending';
    mount(`
      <div class="screen" style="overflow:auto">
        <div style="max-width:620px;margin:0 auto;padding:24px 16px;width:100%">
          <div class="title-xl" style="font-size:2.4rem">V1</div>
          <div class="title-sm" style="margin-bottom:14px">DESLIGAMENTO MANUAL</div>
          <div class="shutdown">
            <div class="sh-title">Sistema de desligamento</div>
            <div class="dim" style="font-size:.75rem;margin-top:6px">
              Gabriel aguarda a resposta. O portão para a camada seguinte está aberto.
            </div>
            <button class="hold-btn" id="hold-btn"><span>Segure para desligar</span><div class="hold-fill" id="hold-fill"></div></button>
            <div class="sh-state" id="sh-state">PRESSIONE E SEGURE</div>
          </div>
          <div class="sysout" id="sysout" style="display:none">
            <div class="ok">> desligando sistemas auxiliares...</div>
            <div class="ok">> drenando reservatório de sangue...</div>
            <div class="off">> combustivel: 0</div>
            <div class="off">> integridade: 0</div>
            <div class="off">> objetivo: —</div>
            <div class="off">> V1: offline</div>
          </div>
        </div>
      </div>`);

    const btn = el('#hold-btn');
    const fill = el('#hold-fill');
    const state = el('#sh-state');
    let raf = 0, t0 = 0, holding = false;
    const DURATION = 1600;
    function loop(ts) {
      if (!holding) return;
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / DURATION);
      fill.style.width = (p * 100) + '%';
      if (p >= 1) { holding = false; finish(); return; }
      raf = requestAnimationFrame(loop);
    }
    function startHold() {
      if (holding) return;
      holding = true; t0 = 0;
      state.textContent = 'DESLIGANDO...';
      BM.audio.play('select');
      raf = requestAnimationFrame(loop);
    }
    function stopHold() {
      if (!holding) return;
      holding = false;
      cancelAnimationFrame(raf);
      if (!el('#sysout').style.display || el('#sysout').style.display === 'none') {
        fill.style.width = '0%';
        state.textContent = 'PRESSIONE E SEGURE';
      }
    }
    function finish() {
      BM.audio.play('shutdown');
      el('#sysout').style.display = 'block';
      state.textContent = 'OFFLINE';
      setTimeout(() => {
        BM.main.finishGame();
      }, 2600);
    }
    btn.addEventListener('pointerdown', startHold);
    btn.addEventListener('pointerup', stopHold);
    btn.addEventListener('pointerleave', stopHold);
    const kh = ev => {
      if (ev.key === ' ') { ev.preventDefault(); if (ev.type === 'keydown') startHold(); else stopHold(); }
    };
    document.addEventListener('keydown', kh);
    document.addEventListener('keyup', kh);
  }

  function postCredits() {
    current = 'credits';
    const d = BM.save.get();
    mount(`
      <div class="screen credits">
        <div class="credits-inner">
          <h2>FIM DO ATO I</h2>
          <div class="credit-line">A carnificina parou.</div>
          <div class="sep"></div>
          <div class="result-lines">
            <div class="rline"><span>Nível final</span><span>${d.v1.level}</span></div>
            <div class="rline"><span>Batalhas</span><span>${d.stats.batalhas}</span></div>
            <div class="rline"><span>Vitórias</span><span>${d.stats.vitorias}</span></div>
            <div class="rline"><span>Mortes</span><span>${d.stats.mortes}</span></div>
            <div class="rline"><span>Parries</span><span>${d.stats.parries}</span></div>
            <div class="rline"><span>Estilo máximo</span><span>${d.stats.estiloMax}</span></div>
            <div class="rline"><span>Sucata restante</span><span>${fmt(d.v1.scrap)}</span></div>
          </div>
          <p class="dim">O Núcleo de V2 ainda pulsa na prateleira da oficina. Alguém pode voltar para buscá-lo.</p>
          <div class="row" style="justify-content:center;margin-top:14px">
            <button class="btn primary" data-a="hub">Voltar à oficina</button>
            <button class="btn" data-a="title">Título</button>
          </div>
        </div>
      </div>`);
    on('[data-a="hub"]', 'click', () => { BM.audio.play('confirm'); lobby(); });
    on('[data-a="title"]', 'click', () => { BM.audio.play('cancel'); title(); });
  }

  /* ---------------- export ---------------- */
  return {
    mount, el, els, toast,
    get current() { return current; },
    title, shop, loadout, lobby, layerMap, dialogue, battle, battleUpdate,
    battleLog, floatText, shake, flashTurn, promptParry, result, options, credits, ending, postCredits
  };
})();
