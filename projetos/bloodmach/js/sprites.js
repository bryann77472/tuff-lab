/* ============================================================
   BLOODMACH — sprites.js
   Arte vetorial procedural: V1, V2, Gabriel, inimigos e cenários.
   ============================================================ */
var BM = (window.BM = window.BM || {});

BM.sprites = (function () {
  'use strict';

  const VB = '0 0 200 260';

  function svg(inner, extra) {
    return '<svg viewBox="' + VB + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">' +
      (extra || '') + inner + '</svg>';
  }

  const defs = `
    <defs>
      <linearGradient id="g-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6a6a72"/><stop offset=".5" stop-color="#3a3a44"/><stop offset="1" stop-color="#20202a"/>
      </linearGradient>
      <linearGradient id="g-steel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#9aa3b0"/><stop offset=".55" stop-color="#4a5361"/><stop offset="1" stop-color="#242a33"/>
      </linearGradient>
      <linearGradient id="g-blood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ff3b5c"/><stop offset="1" stop-color="#7a0a18"/>
      </linearGradient>
      <linearGradient id="g-flesh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b98a78"/><stop offset="1" stop-color="#5c3a34"/>
      </linearGradient>
      <linearGradient id="g-wax" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e8c46a"/><stop offset="1" stop-color="#8a5a1c"/>
      </linearGradient>
      <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#e0b155"/><stop offset="1" stop-color="#8a5f1c"/>
      </linearGradient>
      <linearGradient id="g-bone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#efe7d6"/><stop offset="1" stop-color="#a89a84"/>
      </linearGradient>
      <radialGradient id="g-eye" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#ffd85a"/><stop offset="1" stop-color="#ff7a1a"/>
      </radialGradient>
      <radialGradient id="g-acid" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#c8ff6a"/><stop offset="1" stop-color="#4a7a10"/>
      </radialGradient>
    </defs>`;

  /* ---------------- V1 ---------------- */
  function v1(accent) {
    const ac = accent || '#4aa8ff';
    return svg(defs + `
      <ellipse cx="100" cy="248" rx="62" ry="10" fill="#000" opacity=".45"/>
      <!-- pernas -->
      <g>
        <rect x="66" y="186" width="18" height="52" rx="5" fill="url(#g-metal)"/>
        <rect x="112" y="186" width="18" height="52" rx="5" fill="url(#g-metal)"/>
        <rect x="63" y="196" width="24" height="6" fill="#8b8b96" opacity=".7"/>
        <rect x="109" y="196" width="24" height="6" fill="#8b8b96" opacity=".7"/>
        <rect x="58" y="234" width="34" height="12" rx="3" fill="#2c2c36"/>
        <rect x="104" y="234" width="34" height="12" rx="3" fill="#2c2c36"/>
        <rect x="80" y="190" width="6" height="44" fill="#1a1a22"/>
        <rect x="114" y="190" width="6" height="44" fill="#1a1a22"/>
      </g>
      <!-- torso -->
      <g>
        <path d="M62 108 L138 108 L146 152 L136 190 L64 190 L54 152 Z" fill="url(#g-metal)" stroke="#15151c" stroke-width="3"/>
        <path d="M78 112 L122 112 L126 152 L74 152 Z" fill="#d81f3a" opacity=".9"/>
        <path d="M84 116 L100 116 L100 148 L84 148 Z" fill="#f5efe2" opacity=".85"/>
        <circle cx="100" cy="132" r="9" fill="url(#g-eye)"/>
        <rect x="66" y="156" width="68" height="10" fill="#20202a"/>
        <rect x="86" y="160" width="28" height="4" fill="#8b8b96" opacity=".6"/>
      </g>
      <!-- ombros -->
      <path d="M48 104 L74 100 L78 124 L46 126 Z" fill="url(#g-steel)" stroke="#15151c" stroke-width="3"/>
      <path d="M152 104 L126 100 L122 124 L154 126 Z" fill="url(#g-steel)" stroke="#15151c" stroke-width="3"/>
      <!-- braço esquerdo (mecânico) -->
      <g>
        <rect x="36" y="122" width="18" height="56" rx="6" fill="url(#g-metal)"/>
        <rect x="30" y="172" width="28" height="16" rx="5" fill="#2c2c36"/>
        <rect x="38" y="184" width="8" height="18" rx="3" fill="#3c3c48"/>
        <rect x="50" y="184" width="8" height="18" rx="3" fill="#3c3c48"/>
      </g>
      <!-- braço direito (módulo equipado) -->
      <g>
        <rect x="146" y="122" width="18" height="56" rx="6" fill="url(#g-metal)"/>
        <rect x="140" y="168" width="30" height="26" rx="6" fill="${ac}" stroke="#15151c" stroke-width="3"/>
        <rect x="146" y="174" width="18" height="6" fill="#fff" opacity=".55"/>
        <rect x="146" y="188" width="8" height="16" rx="3" fill="#2c2c36"/>
        <rect x="158" y="188" width="8" height="16" rx="3" fill="#2c2c36"/>
      </g>
      <!-- cabeça -->
      <g>
        <path d="M76 58 L124 58 L132 84 L122 104 L78 104 L68 84 Z" fill="url(#g-metal)" stroke="#15151c" stroke-width="3"/>
        <rect x="74" y="72" width="52" height="14" rx="3" fill="#0d0d12"/>
        <rect x="78" y="76" width="44" height="7" rx="2" fill="url(#g-eye)"/>
        <rect x="94" y="46" width="12" height="14" rx="3" fill="#6a6a72"/>
        <path d="M78 88 L122 88" stroke="#d81f3a" stroke-width="3" opacity=".7"/>
      </g>
      <!-- sangue -->
      <path d="M84 104 q4 16 0 24 q-4 -8 0 -24" fill="url(#g-blood)" opacity=".9"/>
      <path d="M118 104 q3 12 0 18 q-3 -6 0 -18" fill="url(#g-blood)" opacity=".75"/>
    `);
  }

  /* ---------------- V2 ---------------- */
  function v2() {
    return svg(defs + `
      <ellipse cx="100" cy="248" rx="64" ry="10" fill="#000" opacity=".45"/>
      <g>
        <rect x="64" y="184" width="16" height="54" rx="4" fill="url(#g-steel)"/>
        <rect x="118" y="184" width="16" height="54" rx="4" fill="url(#g-steel)"/>
        <rect x="54" y="234" width="36" height="12" rx="3" fill="#232a33"/>
        <rect x="108" y="234" width="36" height="12" rx="3" fill="#232a33"/>
        <rect x="96" y="186" width="6" height="48" fill="#161a20"/>
      </g>
      <path d="M58 104 L142 104 L150 150 L138 190 L62 190 L50 150 Z" fill="url(#g-steel)" stroke="#0f1319" stroke-width="3"/>
      <path d="M76 108 L124 108 L128 150 L72 150 Z" fill="#1c2b3a"/>
      <path d="M86 112 L100 112 L100 146 L86 146 Z" fill="#3fd8d8" opacity=".9"/>
      <circle cx="100" cy="130" r="8" fill="#7fe8ff"/>
      <rect x="46" y="100" width="30" height="22" rx="4" fill="#39424f" stroke="#0f1319" stroke-width="3"/>
      <rect x="124" y="100" width="30" height="22" rx="4" fill="#39424f" stroke="#0f1319" stroke-width="3"/>
      <rect x="34" y="120" width="16" height="58" rx="5" fill="url(#g-steel)"/>
      <rect x="28" y="172" width="28" height="18" rx="5" fill="#1d232b"/>
      <rect x="150" y="120" width="16" height="58" rx="5" fill="url(#g-steel)"/>
      <rect x="146" y="170" width="30" height="24" rx="6" fill="#4aa8ff" stroke="#0f1319" stroke-width="3"/>
      <rect x="152" y="176" width="18" height="6" fill="#fff" opacity=".6"/>
      <path d="M74 56 L126 56 L134 84 L124 106 L76 106 L66 84 Z" fill="url(#g-steel)" stroke="#0f1319" stroke-width="3"/>
      <rect x="70" y="70" width="60" height="16" rx="4" fill="#0b0e12"/>
      <rect x="76" y="74" width="48" height="8" rx="2" fill="#7fe8ff"/>
      <path d="M84 90 L116 90 L112 98 L88 98 Z" fill="#1d232b"/>
      <path d="M88 96 L112 96 L110 104 L90 104 Z" fill="#d81f3a" opacity=".85"/>
    `);
  }

  /* ---------------- GABRIEL ---------------- */
  function gabriel() {
    return svg(defs + `
      <ellipse cx="100" cy="250" rx="70" ry="10" fill="#000" opacity=".5"/>
      <!-- asas -->
      <g opacity=".92">
        <path d="M66 92 L20 40 L34 96 L14 118 L60 130 Z" fill="url(#g-gold)" stroke="#4a3210" stroke-width="3"/>
        <path d="M134 92 L180 40 L166 96 L186 118 L140 130 Z" fill="url(#g-gold)" stroke="#4a3210" stroke-width="3"/>
        <path d="M64 98 L34 62 M60 110 L28 84 M136 98 L166 62 M140 110 L172 84" stroke="#7a5620" stroke-width="2" opacity=".7"/>
      </g>
      <!-- corpo -->
      <path d="M74 96 L126 96 L134 150 L124 202 L76 202 L66 150 Z" fill="url(#g-bone)" stroke="#6b6252" stroke-width="3"/>
      <path d="M88 100 L112 100 L114 140 L86 140 Z" fill="#c8a15a" opacity=".5"/>
      <rect x="72" y="150" width="56" height="9" fill="#c8a15a" opacity=".8"/>
      <path d="M74 202 L126 202 L132 236 L68 236 Z" fill="url(#g-bone)" stroke="#6b6252" stroke-width="3"/>
      <!-- cabeça -->
      <path d="M82 44 L118 44 L124 70 L116 92 L84 92 L76 70 Z" fill="url(#g-bone)" stroke="#6b6252" stroke-width="3"/>
      <path d="M84 62 L116 62 L114 70 L86 70 Z" fill="#1a1a22"/>
      <circle cx="93" cy="66" r="3" fill="#fff"/><circle cx="107" cy="66" r="3" fill="#fff"/>
      <path d="M90 78 L110 78" stroke="#8a8272" stroke-width="3"/>
      <!-- halo -->
      <ellipse cx="100" cy="34" rx="34" ry="10" fill="none" stroke="#ffb43c" stroke-width="5" opacity=".95"/>
      <ellipse cx="100" cy="34" rx="34" ry="10" fill="none" stroke="#fff0b0" stroke-width="2" opacity=".8"/>
      <!-- espada -->
      <g>
        <rect x="164" y="96" width="9" height="120" rx="3" fill="url(#g-gold)" stroke="#4a3210" stroke-width="2"/>
        <rect x="150" y="212" width="36" height="8" rx="3" fill="#4a3210"/>
        <rect x="164" y="220" width="9" height="22" rx="3" fill="#6b4a10"/>
      </g>
      <!-- braço -->
      <rect x="140" y="100" width="14" height="46" rx="5" fill="url(#g-bone)" stroke="#6b6252" stroke-width="2"/>
    `);
  }

  /* ---------------- HUSKS ---------------- */
  function huskBase(opts) {
    const o = Object.assign({ body:'#8d7a70', mask:'#efe7d6', bulk:1, blood:true, hood:false, chains:false, drip:true }, opts || {});
    const w = 26 * o.bulk, h = 40 * o.bulk;
    return svg(defs + `
      <ellipse cx="100" cy="250" rx="${40 * o.bulk}" ry="8" fill="#000" opacity=".45"/>
      <g>
        <rect x="${86 - w / 2}" y="196" width="${w * 0.36}" height="${46}" fill="#4a3d38"/>
        <rect x="${114 - w / 2}" y="196" width="${w * 0.36}" height="${46}" fill="#4a3d38"/>
        <rect x="${80 - w / 2}" y="238" width="${w * 0.5}" height="10" rx="2" fill="#2e2521"/>
        <rect x="${110 - w / 2}" y="238" width="${w * 0.5}" height="10" rx="2" fill="#2e2521"/>
      </g>
      <path d="M${100 - w} 150 L${100 + w} 150 L${100 + w * 0.8} 202 L${100 - w * 0.8} 202 Z" fill="url(#g-flesh)" stroke="#3a2620" stroke-width="3"/>
      <rect x="${100 - w * 0.55}" y="158" width="${w * 1.1}" height="12" fill="#7a3a38" opacity=".55"/>
      <rect x="${100 - w * 1.05}" y="112" width="${w * 0.36}" height="46" rx="4" fill="url(#g-flesh)"/>
      <rect x="${100 + w * 0.7}" y="112" width="${w * 0.36}" height="46" rx="4" fill="url(#g-flesh)"/>
      <g>
        <ellipse cx="100" cy="82" rx="${26 * o.bulk}" ry="${28 * o.bulk}" fill="${o.body}"/>
        ${o.hood ? `<path d="M${100 - 30 * o.bulk} 88 q${30 * o.bulk} -${44 * o.bulk} ${60 * o.bulk} 0 q-${30 * o.bulk} ${12 * o.bulk} -${60 * o.bulk} 0 Z" fill="#241c1a"/>` : ''}
        <ellipse cx="100" cy="86" rx="${17 * o.bulk}" ry="${20 * o.bulk}" fill="${o.mask}"/>
        <rect x="${100 - 11 * o.bulk}" y="80" width="${8 * o.bulk}" height="4" fill="#160d10"/>
        <rect x="${100 + 3 * o.bulk}" y="80" width="${8 * o.bulk}" height="4" fill="#160d10"/>
        <rect x="${100 - 7 * o.bulk}" y="93" width="${14 * o.bulk}" height="3" fill="#6b3a38"/>
        ${o.drip ? `<path d="M${100 + 6 * o.bulk} 100 q3 12 0 18 q-3 -6 0 -18" fill="url(#g-blood)"/>` : ''}
      </g>
      ${o.chains ? `<g stroke="#7a6a58" stroke-width="3" fill="none">
        <path d="M${100 - w * 0.9} 128 q-14 18 -4 34"/><path d="M${100 + w * 0.9} 128 q14 18 4 34"/>
        <circle cx="${100 - w * 0.9 - 4}" cy="130" r="4"/><circle cx="${100 + w * 0.9 + 4}" cy="130" r="4"/>
      </g>` : ''}
    `);
  }

  const husks = {
    husk_gordo: () => huskBase({ body:'#9a7f6d', bulk:1.35, mask:'#efe7d6' }),
    husk_vomito: () => huskBase({ body:'#7d6a52', bulk:1.15, mask:'#d8cbb0', blood:true }),
    husk_penitente: () => huskBase({ body:'#4f4750', bulk:0.95, mask:'#cfc4ad', hood:true, chains:true }),
    husk: () => huskBase({ body:'#8d7a70', bulk:1 }),
  };

  /* ---------------- MÁQUINAS ---------------- */
  function machineBase(opts) {
    const o = Object.assign({ shell:'#5a6470', eye:'#ff9d2e', acid:false, heavy:false }, opts || {});
    return svg(defs + `
      <ellipse cx="100" cy="250" rx="58" ry="9" fill="#000" opacity=".45"/>
      <g>
        <rect x="70" y="190" width="16" height="48" fill="#2b3138"/>
        <rect x="114" y="190" width="16" height="48" fill="#2b3138"/>
        <rect x="58" y="234" width="40" height="12" rx="3" fill="#1b1f24"/>
        <rect x="104" y="234" width="40" height="12" rx="3" fill="#1b1f24"/>
      </g>
      ${o.heavy ? `<rect x="52" y="140" width="96" height="58" rx="6" fill="${o.shell}" stroke="#12161a" stroke-width="3"/>
      <rect x="60" y="150" width="80" height="16" fill="#3d454e"/>` : ''}
      <path d="M62 108 L138 108 L146 152 L136 196 L64 196 L54 152 Z" fill="${o.shell}" stroke="#12161a" stroke-width="3"/>
      <rect x="74" y="118" width="52" height="26" rx="4" fill="#1b1f24"/>
      <circle cx="100" cy="131" r="10" fill="${o.eye}"/>
      <circle cx="100" cy="131" r="4" fill="#1b1f24"/>
      <rect x="76" y="158" width="48" height="10" fill="#3d454e"/>
      <rect x="40" y="112" width="20" height="60" rx="5" fill="${o.shell}" stroke="#12161a" stroke-width="3"/>
      <rect x="140" y="112" width="20" height="60" rx="5" fill="${o.shell}" stroke="#12161a" stroke-width="3"/>
      <rect x="34" y="166" width="30" height="20" rx="4" fill="#2b3138"/>
      <rect x="136" y="166" width="30" height="20" rx="4" fill="#2b3138"/>
      <g>
        <rect x="78" y="52" width="44" height="30" rx="4" fill="${o.shell}" stroke="#12161a" stroke-width="3"/>
        <rect x="86" y="62" width="28" height="8" rx="2" fill="${o.eye}" opacity=".95"/>
        <rect x="94" y="40" width="12" height="14" fill="#39424f"/>
      </g>
      ${o.acid ? `<g>
        <ellipse cx="100" cy="98" rx="26" ry="16" fill="#3d5a20" stroke="#1d2a10" stroke-width="3"/>
        <ellipse cx="100" cy="94" rx="20" ry="10" fill="url(#g-acid)"/>
      </g>` : ''}
    `);
  }

  const machines = {
    machine: () => machineBase({}),
    machine_acid: () => machineBase({ shell:'#4c5a48', eye:'#c8ff6a', acid:true }),
    machine_heavy: () => machineBase({ shell:'#4a5058', eye:'#ff5a3c', heavy:true }),
  };

  /* ---------------- CRIATURAS ---------------- */
  function beast() {
    return svg(defs + `
      <ellipse cx="100" cy="246" rx="66" ry="9" fill="#000" opacity=".45"/>
      <g>
        <rect x="58" y="196" width="14" height="42" fill="#3a2a26"/>
        <rect x="90" y="196" width="14" height="42" fill="#3a2a26"/>
        <rect x="122" y="196" width="14" height="42" fill="#3a2a26"/>
        <rect x="112" y="196" width="14" height="42" fill="#3a2a26"/>
      </g>
      <path d="M52 140 q30 -26 74 -12 q26 8 26 30 q0 26 -30 32 q-52 8 -70 -20 z" fill="url(#g-flesh)" stroke="#2e1d19" stroke-width="3"/>
      <path d="M62 132 l10 -18 l8 16 z M86 122 l10 -20 l8 18 z M110 118 l10 -18 l8 16 z" fill="#e2d9c6" opacity=".9"/>
      <g>
        <path d="M136 138 q28 -8 34 12 q-14 18 -34 14 z" fill="url(#g-flesh)" stroke="#2e1d19" stroke-width="3"/>
        <path d="M150 148 l16 6 l-16 6 z" fill="#f0e6d2"/>
        <circle cx="146" cy="136" r="4" fill="#ff5a3c"/>
      </g>
      <path d="M60 150 q10 12 4 24" stroke="url(#g-blood)" stroke-width="4" fill="none" opacity=".8"/>
    `);
  }

  function demon() {
    return svg(defs + `
      <ellipse cx="100" cy="250" rx="58" ry="9" fill="#000" opacity=".45"/>
      <g>
        <rect x="72" y="192" width="18" height="46" fill="#5a3a12"/>
        <rect x="112" y="192" width="18" height="46" fill="#5a3a12"/>
        <rect x="62" y="234" width="36" height="12" rx="3" fill="#3a2608"/>
        <rect x="104" y="234" width="36" height="12" rx="3" fill="#3a2608"/>
      </g>
      <path d="M64 106 L136 106 L146 156 L134 198 L66 198 L54 156 Z" fill="url(#g-wax)" stroke="#5a3a12" stroke-width="3"/>
      <path d="M78 116 q-6 24 2 40 q-10 -14 -2 -40" fill="#e8c46a" opacity=".8"/>
      <path d="M120 118 q8 20 0 36 q10 -12 0 -36" fill="#e8c46a" opacity=".7"/>
      <rect x="46" y="108" width="22" height="52" rx="6" fill="url(#g-wax)" stroke="#5a3a12" stroke-width="3"/>
      <rect x="132" y="108" width="22" height="52" rx="6" fill="url(#g-wax)" stroke="#5a3a12" stroke-width="3"/>
      <g>
        <ellipse cx="100" cy="76" rx="26" ry="28" fill="url(#g-wax)" stroke="#5a3a12" stroke-width="3"/>
        <path d="M78 54 q-10 -16 -2 -24 q10 8 12 22 z" fill="#e8c46a" stroke="#5a3a12" stroke-width="2"/>
        <path d="M122 54 q10 -16 2 -24 q-10 8 -12 22 z" fill="#e8c46a" stroke="#5a3a12" stroke-width="2"/>
        <ellipse cx="91" cy="76" rx="5" ry="6" fill="#ff5a3c"/>
        <ellipse cx="109" cy="76" rx="5" ry="6" fill="#ff5a3c"/>
        <path d="M88 92 q12 8 24 0" stroke="#5a3a12" stroke-width="3" fill="none"/>
      </g>
    `);
  }

  function heart() {
    return svg(defs + `
      <ellipse cx="100" cy="236" rx="46" ry="8" fill="#000" opacity=".4"/>
      <g stroke="#7a0f1c" stroke-width="7" fill="none" opacity=".9">
        <path d="M70 130 q-22 -26 -6 -44"/><path d="M130 130 q22 -26 6 -44"/>
        <path d="M100 122 q-14 -30 0 -46"/>
      </g>
      <path d="M100 236 C50 210 44 156 66 134 C82 118 100 128 100 140 C100 128 118 118 134 134 C156 156 150 210 100 236 Z"
            fill="url(#g-blood)" stroke="#5a0a14" stroke-width="4"/>
      <ellipse cx="86" cy="164" rx="9" ry="12" fill="#fff" opacity=".85"/>
      <circle cx="86" cy="164" r="5" fill="#1a0a0c"/>
      <path d="M112 186 q10 8 20 0" stroke="#5a0a14" stroke-width="3" fill="none"/>
    `);
  }

  function angel(kind) {
    const halo = kind === 'angel_watch';
    return svg(defs + `
      <ellipse cx="100" cy="248" rx="50" ry="9" fill="#000" opacity=".45"/>
      <g opacity=".9">
        <path d="M76 110 L40 66 L52 116 L70 132 Z" fill="url(#g-bone)" stroke="#6b6252" stroke-width="2"/>
        <path d="M124 110 L160 66 L148 116 L130 132 Z" fill="url(#g-bone)" stroke="#6b6252" stroke-width="2"/>
      </g>
      <path d="M78 104 L122 104 L128 158 L120 202 L80 202 L72 158 Z" fill="url(#g-bone)" stroke="#6b6252" stroke-width="3"/>
      <rect x="78" y="202" width="44" height="36" fill="url(#g-bone)" stroke="#6b6252" stroke-width="3"/>
      <rect x="60" y="106" width="16" height="46" rx="4" fill="url(#g-bone)" stroke="#6b6252" stroke-width="2"/>
      <rect x="124" y="106" width="16" height="46" rx="4" fill="url(#g-bone)" stroke="#6b6252" stroke-width="2"/>
      <g>
        <ellipse cx="100" cy="72" rx="22" ry="24" fill="url(#g-bone)" stroke="#6b6252" stroke-width="3"/>
        <rect x="86" y="66" width="28" height="8" rx="3" fill="#1a1a22"/>
        <circle cx="93" cy="70" r="2.5" fill="#fff"/><circle cx="107" cy="70" r="2.5" fill="#fff"/>
        ${halo ? `<g stroke="#c8a15a" stroke-width="3" fill="none"><ellipse cx="100" cy="40" rx="26" ry="7"/></g>
        <g fill="url(#g-gold)"><path d="M74 42 l-8 -12 l12 6 z"/><path d="M126 42 l8 -12 l-12 6 z"/></g>` : ''}
      </g>
      ${kind === 'angel_watch' ? `<g><rect x="146" y="120" width="8" height="96" rx="3" fill="url(#g-gold)"/></g>` : `<g><rect x="148" y="130" width="7" height="90" rx="3" fill="url(#g-gold)"/></g>`}
    `);
  }

  function motor() {
    return svg(defs + `
      <rect x="30" y="40" width="140" height="170" rx="10" fill="#1a2220" stroke="#2f6b4c" stroke-width="4"/>
      <rect x="42" y="52" width="116" height="86" rx="4" fill="#0b1512" stroke="#2f6b4c" stroke-width="2"/>
      <g fill="#57d68b" font-family="monospace" font-size="11">
        <text x="50" y="72">&gt; SISTEMA V1</text>
        <text x="50" y="90">&gt; SANGUE 00%</text>
        <text x="50" y="108">&gt; DESCENDO...</text>
        <text x="50" y="126">&gt; _</text>
      </g>
      <rect x="42" y="150" width="116" height="12" fill="#0b1512" stroke="#2f6b4c" stroke-width="2"/>
      <rect x="42" y="172" width="116" height="12" fill="#0b1512" stroke="#2f6b4c" stroke-width="2"/>
      <circle cx="60" cy="196" r="7" fill="#57d68b"/>
      <circle cx="82" cy="196" r="7" fill="#7a2a2a"/>
      <rect x="42" y="60" width="40" height="4" fill="#57d68b" opacity=".6"/>
    `);
  }

  /* ---------------- PORTRETES ---------------- */
  function portrait(kind) {
    if (kind === 'v2') return v2();
    if (kind === 'gabriel') return gabriel();
    if (kind === 'motor') return motor();
    if (kind === 'v1') return v1('#4aa8ff');
    return '';
  }

  /* ---------------- CENÁRIOS ---------------- */
  function arena(theme) {
    const a = theme.a, b = theme.b, c = theme.c;
    return '<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${b}"/><stop offset=".62" stop-color="${a}" stop-opacity=".85"/><stop offset="1" stop-color="#0a0708"/>
      </linearGradient></defs>` +
      `<rect width="800" height="360" fill="url(#sky)"/>` +
      `<g fill="#000" opacity=".45">
        <rect x="0" y="210" width="800" height="150"/>
        <path d="M40 210 L70 120 L100 210 Z"/><path d="M140 210 L175 96 L210 210 Z"/>
        <path d="M300 210 L330 140 L360 210 Z"/><path d="M600 210 L640 110 L680 210 Z"/>
        <rect x="420" y="150" width="60" height="60"/>
      </g>` +
      `<g stroke="${c}" stroke-width="2" opacity=".35" fill="none">
        <path d="M0 250 Q200 210 400 250 T800 240"/><path d="M0 285 Q200 250 400 285 T800 275"/>
      </g>` +
      `<g fill="${c}" opacity=".18">
        <circle cx="120" cy="70" r="2"/><circle cx="300" cy="40" r="2"/><circle cx="520" cy="80" r="2"/>
        <circle cx="660" cy="50" r="2"/><circle cx="220" cy="110" r="2"/><circle cx="740" cy="120" r="2"/>
      </g>` +
      `</svg>`;
  }

  function layerArt(id) {
    if (id === 'gluttony') {
      return '<svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="240" height="120" fill="#2a0d0a"/>' +
        '<g fill="#7d1f16" opacity=".85">' +
        '<path d="M0 120 q30 -60 60 -20 q20 26 44 6 q26 -22 46 10 q24 38 46 4 q22 -34 44 0 v20 z"/>' +
        '<path d="M40 60 q22 -34 44 -6" stroke="#d8b25a" stroke-width="3" fill="none" opacity=".7"/>' +
        '</g>' +
        '<g fill="#d8b25a" opacity=".5"><circle cx="66" cy="34" r="5"/><circle cx="120" cy="26" r="4"/><circle cx="180" cy="40" r="6"/></g>' +
        '<g stroke="#4a1008" stroke-width="4" fill="none"><path d="M20 120 v-40"/><path d="M220 120 v-52"/><path d="M200 68 h40"/></g>' +
        '</svg>';
    }
    return '<svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="240" height="120" fill="#2b1206"/>' +
      '<g fill="#c25a1d" opacity=".8"><path d="M0 120 L60 40 L120 120 Z"/><path d="M110 120 L170 30 L240 120 Z"/></g>' +
      '<g stroke="#f0d9a0" stroke-width="2" opacity=".55" fill="none">' +
      '<path d="M60 40 v-20"/><circle cx="60" cy="14" r="7"/><path d="M170 30 v-16"/><circle cx="170" cy="9" r="6"/></g>' +
      '<g fill="#f0d9a0" opacity=".35"><circle cx="30" cy="24" r="3"/><circle cx="210" cy="40" r="3"/><circle cx="120" cy="18" r="2"/></g>' +
      '</svg>';
  }

  /* ---------------- MAPA DE SPRITES ---------------- */
  const registry = {
    v1, v2, gabriel, motor,
    husk_gordo: husks.husk_gordo,
    husk_vomito: husks.husk_vomito,
    husk_penitente: husks.husk_penitente,
    husk: husks.husk,
    machine: machines.machine,
    machine_acid: machines.machine_acid,
    machine_heavy: machines.machine_heavy,
    beast, demon, heart,
    angel_small: () => angel('angel_small'),
    angel_watch: () => angel('angel_watch'),
  };

  return {
    get(name, accent) {
      const fn = registry[name] || registry.husk;
      return fn(accent);
    },
    v1, v2, gabriel, motor, portrait, arena, layerArt
  };
})();
