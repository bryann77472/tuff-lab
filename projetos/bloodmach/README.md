# BLOODMACH — Gluttony // Heresy

Jogo de **batalhas por turnos** em HTML + CSS + JavaScript puro.
Inspirado em **Ultrakill** (parry, sangue, estilo, violência mecânica) e na
estrutura de batalhas de **Pokémon** (menu de 4 movimentos, HP, itens, níveis).

**Sem armas. Sem build. Sem dependências.** Abra o `index.html` e jogue.

---

## Como jogar

Abra `index.html` no navegador (duplo clique). Funciona em `file://`, sem servidor,
sem instalar nada. O progresso é salvo em `localStorage` automaticamente.

### Controles
| Ação | Tecla |
|---|---|
| Movimentos 1–4 | `1` `2` `3` `4` |
| Parry | `Espaço` (ou clique na barra) |
| Avançar diálogo | `Espaço` / `Enter` / clique |
| Voltar | `Esc` |

---

## O que tem no jogo

### Campanha
- **2 camadas**: **Gluttony** (o Corpo do Rei Minos) e **Heresy** (a Catedral Ardente).
- **5 inimigos + 1 chefe** por camada.
- Modificadores de camada: *Digestão Ácida* (cura −30%) e *Fogo da Fé* (Fogo/Luz +20%, parry perfeito reflete 75%).
- Chefe de Gluttony: **V2** — copia seus 2 braços e seus 4 movimentos, e **morre de verdade**.
- Chefe final de Heresy: **Gabriel** — 2 fases, com `SENTENÇA` inevitável.
- **Final:** depois de Gabriel, V1 pode **se desligar**. Um final escolhido, não uma fuga.

### Combate
- **4 movimentos** por batalha. Sem PP — cada técnica tem **recarga em turnos**.
- Você equipa **2 braços** (8 movimentos) e escolhe **4**. Se vierem de braços
  diferentes, você está usando **4 braços** e ganha as passivas de cada um.
- **Sangue = cura**: técnicas marcadas `+X% SANGUE` curam quando acertam.
- **Parry** (só com o Feedbacker equipado): barra com marcador em movimento.
  Centro = perfeito (anula, reflete, atordoa), laterais = bom (metade do dano).
- **Reflexo 50%** contra ataques **imparáveis**, ajustado pelo **peso total**
  (pernas + carcaça): leve 70% → médio 50% → pesado 30%.
- **Distância** Perto / Médio / Longe muda dano de corpo a corpo e de projétil.
- **Estilo** D → SSS multiplica a Sucata no fim da batalha.
- Status: Sangramento, Derretido, Ferrugem, Coágulo, Atordoado, Exposto, Postura.

### Equipamento
| Braço | Cor | Papel |
|---|---|---|
| **Feedbacker** | Azul | Rápido, fraco, libera o **parry** |
| **Knuckleblaster** | Vermelho | Lento, explosivo, forte, empurra |
| **Whiplash** | Verde | Puxa e controla a distância |
| **Bloodreaver** | Carmim | Suga vida do inimigo, sustain |
| **Hellwhip** | Laranja | Corrente de lava: puxa e **derrete** |

**Pernas** (1 slot): *de Serviço* (média, tem **Dash**) · *de Ignição* (pesada, tem
**Arranque Explosivo**) · *de Fibra* (leve, veloz, +esquiva/fuga, sem habilidade).

**Carcaças** (1 slot): *V1* (equilibrada) · *de Fibra* (vida baixa, rápida) ·
*de Forja* (vida alta, lenta).

### Loja
- No **título**, logo abaixo do botão **JOGAR**.
- No **lobby/Oficina**, num terminal, antes de entrar na camada.
- Vende braços, pernas, carcaças e consumíveis, com **Sucata** e **Núcleos**.

---

## Estrutura

```
index.html
css/    base.css  title.css  battle.css  shop.css
js/     data.js     braços, pernas, carcaças, itens, inimigos, camadas, história
        sprites.js  arte vetorial procedural (V1, V2, Gabriel, inimigos, cenários)
        audio.js    efeitos sintetizados via WebAudio (sem arquivos)
        save.js     localStorage, progressão, inventário, preferências
        battle.js   motor de turnos: dano, status, distância, estilo, parry, IA
        ui.js       todas as telas
        main.js     fluxo do jogo
```

Toda a arte é SVG gerado em código e todo o som é sintetizado em tempo real.
Nenhuma dependência, nenhum build.

---

## notas

- Projeto de fã. V1, V2, Gabriel e as camadas vêm de *Ultrakill* (Arsenic Games).
  Sem fins lucrativos, com arte e som próprios.
- Dificuldade, volume, tremor de tela e **assistência de parry** ficam em *Opções*.
- O save é apagado com o botão *Apagar Save* no lobby.
