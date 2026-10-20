/* ============================================================
   BLOODMACH — data.js
   Todos os dados estáticos: tipos, braços, pernas, carcaças,
   itens, inimigos, camadas e história.
   ============================================================ */
var BM = (window.BM = window.BM || {});

BM.DATA = (function () {
  'use strict';

  /* ---------------- TIPOS DE DANO ---------------- */
  const TYPES = {
    corte:   { name: 'Corte',    color: '#9ad7ff', icon: '✦' },
    impacto: { name: 'Impacto',  color: '#ffc266', icon: '◆' },
    explosao:{ name: 'Explosão', color: '#ff6b4a', icon: '✷' },
    sangue:  { name: 'Sangue',   color: '#ff3b5c', icon: '☗' },
    fogo:    { name: 'Fogo',     color: '#ff9d2e', icon: '▲' },
  };

  /* ---------------- FACÇÕES E FRAQUEZAS ---------------- */
  const FACTIONS = {
    casca:   { name: 'Casca',    weak: ['corte', 'impacto'], resist: ['sangue'] },
    maquina: { name: 'Máquina',  weak: ['explosao', 'fogo'],  resist: ['corte'] },
    carne:   { name: 'Carne',    weak: ['corte', 'fogo'],     resist: ['sangue'] },
    demonio: { name: 'Demônio',  weak: ['impacto', 'sangue'], resist: ['fogo'] },
    anjo:    { name: 'Anjo',     weak: ['sangue', 'corte'],   resist: ['impacto', 'fogo'] },
  };

  /* ---------------- MOVIMENTOS DE BRAÇO ---------------- */
  const MOVES = {
    /* Feedbacker (azul) */
    jab_rapido: {
      id:'jab_rapido', name:'Jab Rápido', type:'impacto', power:25, acc:100, cd:0, blood:4,
      priority:true, desc:'Ataque rápido. Age primeiro em empates de velocidade.'
    },
    rajada_tres: {
      id:'rajada_tres', name:'Rajada de Três', type:'impacto', power:12, acc:95, cd:1, blood:6, hits:3,
      desc:'Três golpes rápidos.'
    },
    contra_golpe: {
      id:'contra_golpe', name:'Contra-Golpe', type:'impacto', power:45, acc:100, cd:1, blood:5, effect:'contra',
      desc:'Dano dobrado contra alvos Atordoados ou Expostos.'
    },
    postura_defensiva: {
      id:'postura_defensiva', name:'Postura Defensiva', type:null, power:0, acc:100, cd:3, blood:0, effect:'postura',
      desc:'+30% DEF e janela de parry maior por 2 turnos.'
    },

    /* Knuckleblaster (vermelho) */
    soco_foguete: {
      id:'soco_foguete', name:'Soco-Foguete', type:'explosao', power:55, acc:90, cd:1, blood:0, effect:'push',
      desc:'Explosão que empurra o alvo para longe.'
    },
    carga_sismica: {
      id:'carga_sismica', name:'Carga Sísmica', type:'explosao', power:90, acc:85, cd:3, blood:0, effect:'charge',
      desc:'Carrega por 1 turno e explode no seguinte, quebrando a postura.'
    },
    onda_de_choque: {
      id:'onda_de_choque', name:'Onda de Choque', type:'explosao', power:35, acc:100, cd:2, blood:0, effect:'stun',
      desc:'Choque em área. 30% de atordoar.'
    },
    detonacao: {
      id:'detonacao', name:'Detonação', type:'explosao', power:70, acc:80, cd:2, blood:0, effect:'explodeBonus',
      desc:'+50% de dano contra alvos Expostos.'
    },

    /* Whiplash (verde) */
    puxao: {
      id:'puxao', name:'Puxão', type:'corte', power:20, acc:100, cd:0, blood:5, effect:'pull',
      desc:'Puxa o inimigo para perto.'
    },
    laco: {
      id:'laco', name:'Laço', type:'corte', power:15, acc:90, cd:2, blood:3, effect:'bind',
      desc:'Prende a distância do inimigo por 2 turnos.'
    },
    gancho_vital: {
      id:'gancho_vital', name:'Gancho Vital', type:'corte', power:30, acc:95, cd:2, blood:5, effect:'pullExpose',
      desc:'Puxa e expõe o alvo (próximo golpe é crítico).'
    },
    arremesso: {
      id:'arremesso', name:'Arremesso', type:'impacto', power:45, acc:85, cd:1, blood:4, range:'any',
      desc:'Arremessa sucata. Funciona em qualquer distância.'
    },

    /* Bloodreaver (carmim) */
    drenar: {
      id:'drenar', name:'Drenar', type:'sangue', power:30, acc:100, cd:0, blood:8, effect:'drain',
      desc:'Rouba vida: cura 50% do dano causado.'
    },
    sangria: {
      id:'sangria', name:'Sangria', type:'sangue', power:20, acc:95, cd:1, blood:5, effect:'bleed',
      desc:'Aplica Sangramento por 3 turnos.'
    },
    transfusao: {
      id:'transfusao', name:'Transfusão', type:null, power:0, acc:100, cd:3, blood:0, effect:'healSelf',
      desc:'Cura 25% do HP máximo (40% se o alvo estiver sangrando).'
    },
    banquete: {
      id:'banquete', name:'Banquete', type:'sangue', power:60, acc:90, cd:2, blood:12, effect:'feast',
      desc:'Cura 100% do dano se o alvo estiver sangrando.'
    },

    /* Hellwhip (laranja) */
    chicote_de_lava: {
      id:'chicote_de_lava', name:'Chicote de Lava', type:'fogo', power:30, acc:100, cd:0, blood:4, effect:'melt',
      desc:'Corrente incandescent. Aplica Derretido por 3 turnos.'
    },
    laco_igneo: {
      id:'laco_igneo', name:'Laço Ígneo', type:'fogo', power:20, acc:100, cd:1, blood:5, effect:'pullMelt',
      desc:'Puxa o alvo para perto e o derrete.'
    },
    corrente_fundida: {
      id:'corrente_fundida', name:'Corrente Fundida', type:'fogo', power:45, acc:100, cd:2, blood:6, effect:'meltPierce',
      desc:'Ignora 50% da DEF se o alvo estiver Derretido.'
    },
    erupcao: {
      id:'erupcao', name:'Erupção', type:'fogo', power:70, acc:90, cd:3, blood:8, effect:'consumeMelt',
      desc:'Consome o Derretido para +50% de dano.'
    },
  };

  /* ---------------- BRAÇOS ---------------- */
  const ARMS = [
    {
      id:'feedbacker', name:'Feedbacker', cor:'Azul', corHex:'#4aa8ff', type:'impacto',
      role:'Rápido, parry, fraco', price:0, unlock:'initial',
      passive:{ id:'parry', name:'Parry', desc:'Libera o parry com barra de tempo.' },
      moves:['jab_rapido','rajada_tres','contra_golpe','postura_defensiva']
    },
    {
      id:'knuckleblaster', name:'Knuckleblaster', cor:'Vermelho', corHex:'#ff3b3b', type:'explosao',
      role:'Lento, explosivo, forte', price:0, unlock:'initial',
      passive:{ id:'push', name:'Empurra', desc:'Ataques empurram o alvo para longe.' },
      moves:['soco_foguete','carga_sismica','onda_de_choque','detonacao']
    },
    {
      id:'whiplash', name:'Whiplash', cor:'Verde', corHex:'#3ddc84', type:'corte',
      role:'Puxa e controla a distância', price:0, unlock:'initial',
      passive:{ id:'pullAlways', name:'Puxão certeiro', desc:'O Puxão nunca erra.' },
      moves:['puxao','laco','gancho_vital','arremesso']
    },
    {
      id:'bloodreaver', name:'Bloodreaver', cor:'Carmim', corHex:'#e0417a', type:'sangue',
      role:'Suga vida, sustain', price:300, unlock:'nucleo_v2',
      passive:{ id:'healBonus', name:'Sede', desc:'+25% em toda cura.' },
      moves:['drenar','sangria','transfusao','banquete']
    },
    {
      id:'hellwhip', name:'Hellwhip', cor:'Laranja', corHex:'#ff9d2e', type:'fogo',
      role:'Corrente que puxa e derrete', price:350, unlock:'v2',
      passive:{ id:'anyRange', name:'Alcance Ígneo', desc:'Acerte o alvo em qualquer distância.' },
      moves:['chicote_de_lava','laco_igneo','corrente_fundida','erupcao']
    },
  ];

  /* ---------------- PERNAS ---------------- */
  const LEGS = [
    {
      id:'servico', name:'Pernas de Serviço', peso:0, vel:1.00, esquiva:0.10, fuga:0.50,
      ability:'dash', price:0, unlock:'initial',
      desc:'Configuração de fábrica. Peso e velocidade medianos.',
      abilityDesc:'Dash: 1x por batalha, esquiva completamente um ataque.'
    },
    {
      id:'ignicao', name:'Pernas de Ignição', peso:1, vel:0.85, esquiva:0.05, fuga:0.35,
      ability:'arranque', price:300, unlock:'v2',
      desc:'Estrutura pesada com ignição embutida. Lenta, mas explosiva.',
      abilityDesc:'Arranque Explosivo: 1x por batalha, +50% VEL por 2 turnos e age primeiro.'
    },
    {
      id:'fibra', name:'Pernas de Fibra', peso:-1, vel:1.20, esquiva:0.20, fuga:0.65,
      ability:null, price:200, unlock:'lvl3',
      desc:'Estrutura ultraleve, sem sistema extra. Rápida e frágil.',
      abilityDesc:'Sem habilidade ativa.'
    },
  ];

  /* ---------------- CARCAÇAS ---------------- */
  const CHASSIS = [
    {
      id:'v1', name:'Carcaça V1', peso:0, hp:1.00, vel:1.00, price:0, unlock:'initial',
      desc:'Carcaça original do V1. Equilibrada em tudo.'
    },
    {
      id:'fibra', name:'Carcaça de Fibra', peso:-1, hp:0.80, vel:1.25, price:250, unlock:'lvl3',
      desc:'Placas ultraleves. Muito rápido, muito frágil.'
    },
    {
      id:'forja', name:'Carcaça de Forja', peso:1, hp:1.30, vel:0.80, price:350, unlock:'v2',
      desc:'Blindagem de forja. Aguenta muito, responde pouco.'
    },
  ];

  /* ---------------- ITENS ---------------- */
  const ITEMS = [
    { id:'bolsa_sangue', name:'Bolsa de Sangue', price:40, unlock:'initial', battle:true,
      desc:'Cura 40% do HP na hora.', heal:0.40 },
    { id:'adrenalina', name:'Adrenalina', price:50, unlock:'initial', battle:true,
      desc:'Remove todos os status e concede +1 turno de foco.', cureStatus:true },
    { id:'moeda', name:'Moeda', price:60, unlock:'initial', battle:true,
      desc:'O próximo golpe é crítico garantido.', crit:true },
    { id:'bomba', name:'Bomba', price:80, unlock:'initial', battle:true,
      desc:'60 de dano fixo, ignora DEF.', fixedDamage:60 },
    { id:'kit_reparo', name:'Kit de Reparo', price:120, unlock:'lvl6', battle:true,
      desc:'Revive o V1 com 30% do HP.', revive:true },
  ];

  /* ---------------- INIMIGOS ---------------- */
  const ENEMIES = {
    /* ---- GLUTTONY ---- */
    husk_glutao: {
      id:'husk_glutao', name:'Husk Glutão', faction:'casca', sprite:'husk_gordo',
      hp:120, atk:20, def:14, vel:8, exp:48, scrap:26,
      moves:[
        { name:'Mordida', type:'corte', power:17, acc:95, kind:'melee', range:'perto', parryable:true, text:'VAI MORDER' },
        { name:'Encharcada', type:null, kind:'heal', heal:18, minHp:0.45, text:'VAI SE CURAR' },
        { name:'Casco Duro', type:null, kind:'buff', effect:'buffDef', text:'VAI SE ENDURECER' }
      ]
    },
    maquina_digestora: {
      id:'maquina_digestora', name:'Máquina Digestora', faction:'maquina', sprite:'machine_acid',
      hp:145, atk:22, def:22, vel:5, exp:60, scrap:34,
      moves:[
        { name:'Ácido', type:'sangue', power:16, acc:90, kind:'ranged', range:'longe', parryable:false, effect:'ferrugem', text:'VAI ATIRAR ÁCIDO' },
        { name:'Avalanche', type:'explosao', power:21, acc:85, kind:'explosive', range:'any', parryable:false, text:'VAI ESMAGAR' },
        { name:'Calibragem', type:null, kind:'buff', effect:'buffAtk', text:'VAI SE CALIBRAR' }
      ]
    },
    cao_de_carne: {
      id:'cao_de_carne', name:'Cão de Carne', faction:'carne', sprite:'beast',
      hp:92, atk:19, def:11, vel:16, exp:44, scrap:24,
      moves:[
        { name:'Garra', type:'corte', power:15, acc:95, kind:'melee', range:'perto', parryable:true, effect:'bleed', text:'VAI RASGAR' },
        { name:'Salto', type:'corte', power:19, acc:90, kind:'melee', range:'any', parryable:true, effect:'approach', text:'VAI AVANÇAR' }
      ]
    },
    husk_vomito: {
      id:'husk_vomito', name:'Husk Vômito', faction:'casca', sprite:'husk_vomito',
      hp:98, atk:19, def:13, vel:9, exp:50, scrap:28,
      moves:[
        { name:'Vômito', type:'sangue', power:16, acc:88, kind:'ranged', range:'longe', parryable:false, effect:'ferrugem', text:'VAI VOMITAR' },
        { name:'Soco Úmido', type:'impacto', power:16, acc:95, kind:'melee', range:'perto', parryable:true, text:'VAI SOCAR' }
      ]
    },
    carnical_de_ferro: {
      id:'carnical_de_ferro', name:'Carniçal de Ferro', faction:'maquina', sprite:'machine_heavy',
      hp:170, atk:24, def:26, vel:4, exp:85, scrap:46,
      moves:[
        { name:'Impacto', type:'impacto', power:24, acc:92, kind:'melee', range:'perto', parryable:true, text:'VAI ESMAGAR' },
        { name:'Martelada', type:'explosao', power:24, acc:88, kind:'explosive', range:'any', parryable:false, text:'VAI MARTELAR' },
        { name:'Barreira', type:null, kind:'buff', effect:'buffDef', text:'VAI SE BARREAR' }
      ]
    },

    /* ---- HERESY ---- */
    serafim_menor: {
      id:'serafim_menor', name:'Serafim Menor', faction:'anjo', sprite:'angel_small',
      hp:125, atk:21, def:16, vel:12, exp:66, scrap:34,
      moves:[
        { name:'Lança de Luz', type:'fogo', power:18, acc:92, kind:'ranged', range:'longe', parryable:true, text:'VAI LANÇAR LUZ' },
        { name:'Golpe Sagrado', type:'impacto', power:19, acc:94, kind:'melee', range:'perto', parryable:true, text:'VAI GOLPEAR' },
        { name:'Bênção', type:null, kind:'heal', heal:20, minHp:0.5, text:'VAI SE CURAR' }
      ]
    },
    anjo_vigia: {
      id:'anjo_vigia', name:'Anjo Vigia', faction:'anjo', sprite:'angel_watch',
      hp:155, atk:24, def:20, vel:14, exp:80, scrap:42,
      moves:[
        { name:'Corte', type:'corte', power:21, acc:95, kind:'melee', range:'perto', parryable:true, text:'VAI CORTAR' },
        { name:'Julgamento', type:'fogo', power:20, acc:90, kind:'ranged', range:'longe', parryable:false, text:'VAI JULGAR' },
        { name:'Vingança', type:'impacto', power:26, acc:85, kind:'melee', range:'perto', parryable:true, text:'VAI VINGAR' }
      ]
    },
    demonio_de_cera: {
      id:'demonio_de_cera', name:'Demônio de Cera', faction:'demonio', sprite:'demon',
      hp:165, atk:25, def:19, vel:10, exp:86, scrap:45,
      moves:[
        { name:'Chama', type:'fogo', power:20, acc:90, kind:'ranged', range:'longe', parryable:false, text:'VAI QUEIMAR' },
        { name:'Impacto de Cera', type:'impacto', power:24, acc:92, kind:'melee', range:'perto', parryable:true, text:'VAI AMASSAR' },
        { name:'Escudo de Cera', type:null, kind:'buff', effect:'buffDef', text:'VAI SE ENDURECER' }
      ]
    },
    coracao_herege: {
      id:'coracao_herege', name:'Coração Herege', faction:'carne', sprite:'heart',
      hp:135, atk:21, def:17, vel:8, exp:72, scrap:38,
      moves:[
        { name:'Bomba de Sangue', type:'sangue', power:18, acc:92, kind:'ranged', range:'longe', parryable:true, text:'VAI ARREMESSAR SANGUE' },
        { name:'Sucata Vital', type:null, kind:'heal', heal:22, minHp:0.5, text:'VAI SE CURAR' },
        { name:'Golpe', type:'impacto', power:19, acc:94, kind:'melee', range:'perto', parryable:true, text:'VAI GOLPEAR' }
      ]
    },
    husk_penitente: {
      id:'husk_penitente', name:'Husk Penitente', faction:'casca', sprite:'husk_penitente',
      hp:92, atk:19, def:12, vel:18, exp:58, scrap:30,
      moves:[
        { name:'Chicote', type:'corte', power:16, acc:94, kind:'melee', range:'perto', parryable:true, effect:'bleed', text:'VAI CHICOTEAR' },
        { name:'Pêntano', type:'corte', power:19, acc:90, kind:'melee', range:'any', parryable:true, effect:'approach', text:'VAI AVANÇAR' },
        { name:'Bênção Negra', type:null, kind:'heal', heal:15, minHp:0.55, text:'VAI SE CURAR' }
      ]
    },

    /* ---- CHEFES ---- */
    v2: {
      id:'v2', name:'V2', faction:'maquina', sprite:'v2',
      hp:380, atk:22, def:20, vel:13, exp:300, scrap:170, boss:true, copies:true,
      moves:[
        { name:'Overclock', type:'explosao', power:26, acc:90, kind:'explosive', range:'any', parryable:false, text:'VAI EXPLODIR' },
        { name:'Varredura', type:'impacto', power:21, acc:94, kind:'melee', range:'perto', parryable:true, text:'VAI VARRER' },
        { name:'Recarga', type:null, kind:'buff', effect:'buffAtk', text:'VAI SE RECARREGAR' }
      ]
    },
    gabriel: {
      id:'gabriel', name:'Gabriel', faction:'anjo', sprite:'gabriel',
      hp:560, atk:24, def:26, vel:12, exp:520, scrap:300, boss:true,
      moves:[
        { name:'Espada', type:'corte', power:23, acc:95, kind:'melee', range:'perto', parryable:true, text:'VAI DESFERRIR' },
        { name:'Combo Sagrado', type:'impacto', power:28, acc:92, kind:'melee', range:'perto', parryable:true, text:'VAI COMBINAR' },
        { name:'Julgamento', type:'fogo', power:22, acc:90, kind:'ranged', range:'longe', parryable:false, text:'VAI JULGAR' },
        { name:'Coro de Anjos', type:null, kind:'buff', effect:'buffAtk', text:'VAI INVOCAR' },
        { name:'Sentença', type:'explosao', power:34, acc:100, kind:'inevitable', range:'any', parryable:false, unavoidable:true, minHp:0.35, text:'SENTENÇA FINAL' }
      ]
    },
  };

  /* ---------------- CAMADAS ---------------- */
  const LAYERS = [
    {
      id:'gluttony', name:'Gluttony', subtitle:'O Corpo do Rei Minos', roman:'I',
      desc:'Fábrica de digestão. Carnemillah.',
      modifier:{ id:'acido', name:'Digestão Ácida', desc:'Toda cura é 30% menor.', healMul:0.70 },
      art:'gluttony',
      encounters:['husk_glutao','maquina_digestora','cao_de_carne','husk_vomito','carnical_de_ferro'],
      boss:'v2',
      checkpoints:[1,3,5],
      theme:{ a:'#7d1f16', b:'#2a0d0a', c:'#d8b25a' }
    },
    {
      id:'heresy', name:'Heresy', subtitle:'A Catedral Ardente', roman:'II',
      desc:'Catedral de anjos e brasa. O julgamento final.',
      modifier:{ id:'fe', name:'Fogo da Fé', desc:'Dano de Fogo e Luz +20%. Parry perfeito reflete 75%.', fireMul:1.20, reflect:0.75 },
      art:'heresy',
      encounters:['serafim_menor','anjo_vigia','demonio_de_cera','coracao_herege','husk_penitente'],
      boss:'gabriel',
      checkpoints:[1,3,5],
      theme:{ a:'#c25a1d', b:'#2b1206', c:'#f0d9a0' }
    },
  ];

  /* ---------------- HISTÓRIA ---------------- */
  const STORY = {
    intro: [
      { who:'...', text:'Sangue: 0%. Integridade: 0%. Objetivo: nenhum.', portrait:null },
      { who:'MOTOR', text:'Unidade V1 detectada. Sangue insuficiente. Recommendado: descer.', portrait:'motor' },
      { who:'V1', text:'[ ... ]', portrait:'v1' },
      { who:'MOTOR', text:'Você está dentro do corpo do Rei Minos. A carnificina consome a carne e o sangue de Veyra desde sempre.', portrait:'motor' },
      { who:'MOTOR', text:'Existe um motor lá embaixo. Encontre-o. E não se torne a máquina.', portrait:'motor' },
      { who:'V2', text:'Olha só. A versão antiga ainda respira.', portrait:'v2' },
      { who:'V2', text:'Você não passa de um protótipo enferrujado. Eu sou o próximo passo.', portrait:'v2' },
      { who:'V1', text:'[ ... ]', portrait:'v1' }
    ],
    afterV2: [
      { who:'V2', text:'Então... era isso? Um punho velho contra uma máquina nova.', portrait:'v2' },
      { who:'V2', text:'Eu sou o modelo. Você é a peça descartada.', portrait:'v2' },
      { who:'V2', text:'— pare. Você não tem sangue. Não tem mais nada.', portrait:'v2' },
      { who:'MOTOR', text:'Unidade V2 desativada. Núcleo EXTRAÍDO. Novos sistemas disponíveis para integração.', portrait:'motor' },
      { who:'MOTOR', text:'Abaixo: Heresy. O local do julgamento. Gabriel aguarda.', portrait:'motor' }
    ],
    heresyStart: [
      { who:'MOTOR', text:'Catedral de Heresy. A forja arde em reza. Não há estrutura estável para múltiplas unidades.', portrait:'motor' },
      { who:'MOTOR', text:'Recomendo: parry. O Feedbacker responde bem contra lâminas de luz.', portrait:'motor' }
    ],
    gabrielBefore: [
      { who:'GABRIEL', text:'Então é você. A lâmina que não aceita ser julgada.', portrait:'gabriel' },
      { who:'GABRIEL', text:'Você não tem alma, V1. Não tem alma, e por isso não tem perdão. Só fome, e metal.', portrait:'gabriel' },
      { who:'GABRIEL', text:'Vou mostrar qual de nós dois foi feito para seguir em frente.', portrait:'gabriel' }
    ],
    gabrielAfter: [
      { who:'GABRIEL', text:'...Isso não estava no cálculo.', portrait:'gabriel' },
      { who:'GABRIEL', text:'O portão está aberto. O sangue lá embaixo é infinito. Você pode descer, pode devorar tudo.', portrait:'gabriel' },
      { who:'GABRIEL', text:'Ou pode parar. Como?', portrait:'gabriel' }
    ],
    ending: [
      { who:'GABRIEL', text:'...', portrait:'gabriel' },
      { who:'GABRIEL', text:'A carnificina parou de bombear. As máquinas lá embaixo vão apodrecer em paz.', portrait:'gabriel' },
      { who:'GABRIEL', text:'Você era a fera, e mesmo assim... escolheu o fim.', portrait:'gabriel' },
      { who:'GABRIEL', text:'Eu não sei se isso é vitória. Mas é... humano.', portrait:'gabriel' }
    ]
  };

  /* ---------------- RANK DE ESTILO ---------------- */
  const STYLE_RANKS = [
    { key:'D',   min:0,    mult:1.0,  color:'#8a7f78' },
    { key:'C',   min:120,  mult:1.15, color:'#b09a7a' },
    { key:'B',   min:300,  mult:1.3,  color:'#c8a15a' },
    { key:'A',   min:560,  mult:1.5,  color:'#ff9d2e' },
    { key:'S',   min:900,  mult:1.75, color:'#ff7a3c' },
    { key:'SS',  min:1350, mult:2.0,  color:'#ff3355' },
    { key:'SSS', min:1900, mult:2.4,  color:'#ff5a72' },
  ];

  const DIFFICULTIES = {
    facil:   { name:'Humano',   parryMs:1500, dmgEnemy:0.80, dmgPlayer:1.10, scrap:0.9 },
    normal:  { name:'Padrão',   parryMs:1050, dmgEnemy:1.00, dmgPlayer:1.00, scrap:1.0 },
    dificil: { name:'Violento', parryMs:780,  dmgEnemy:1.25, dmgPlayer:1.00, scrap:1.35 },
  };

  return {
    TYPES, FACTIONS, MOVES, ARMS, LEGS, CHASSIS, ITEMS,
    ENEMIES, LAYERS, STORY, STYLE_RANKS, DIFFICULTIES
  };
})();
