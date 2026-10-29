# Immortal Snail Chess Academy v2.1 — Style Studio & Unlockable Arenas

A lightweight, offline-capable classroom chess collection. The original four modes remain: **Classic Chess**, **Immortal Snail**, **Hungry Snails**, and **Starship Tri-Level Chess**.

## New in v2.1

The **Style Studio** menu includes 16 original cosmetic choices, split into four groups:

| Category | Available looks | XP required |
|---|---|---|
| 3D pieces | Classic / Robot Legion / Mythic Kingdom / Cosmic Guardians | 0 / 120 / 260 / 450 |
| Boards | Tournament Wood / Neon Circuit / Ancient Stone / Starship Deck | 0 / 150 / 300 / 500 |
| Arenas | Grand Hall / Enchanted Forest / Lava Fortress / Moon Base | 0 / 100 / 240 / 400 |
| Snails | Original / Mecha / Slime / Nebula | 0 / 130 / 270 / 430 |

- Each selection is cosmetic only: pieces still have the ordinary chess movement rules.
- The main 3D game uses original procedural mesh additions (robotic armor, creature horns, cosmic orbs) and themed exterior scenery; the Starship board uses matching colors and decorative glyph frames because it is a separate 2D perspective-SVG renderer.
- Custom team colors, original 3D orbit controls, all existing game modes, and original rules remain intact.
- Locked styles may be previewed temporarily. They can be equipped permanently after reaching the XP threshold.
- A small trophy case tracks accomplishments such as the first move, opening practice, special moves, and lessons.

## How students earn XP

- First 14 chess moves in each match: 3 XP each; additional 20 XP upon the tenth move.
- Captures: 8 XP; castling: 40 XP; pawn promotion: 55 XP; en passant: 60 XP.
- Completed guided lesson: 65 XP.
- A completed game: 90 XP, plus a possible winning bonus.
- Surviving a scheduled snail movement: 12 XP.
- Starship Tri-Level Chess also awards XP for played moves, captures, completing a match, and finishing its tutorial.

XP is for motivation and unlocking cosmetic appearances, not a formal measure of chess mastery. Guided demonstrations do not award per-move XP.

## Storage and privacy

The game saves XP, unlocked choices, and preferences in the browser's **localStorage** using the key `chess-academy-cosmetics-v21`. Both HTML pages must be published **under the same GitHub Pages site/origin** to share progress. This is local to a browser/device and does not follow school accounts, students, or Chromebooks automatically. On shared classroom devices, students may share the same unlock history. Clearing site data removes local progress. The Style Studio has a **Reset local progress** control requiring confirmation.

No sign-in, external APIs, or separate images are required. These styles are original chess/fantasy/arcade homages rather than copies of licensed video game characters. This package changes only the Chess Academy game, **not** the Naches Learning Hub's main activity directory.

## Files

- `index.html` — Chess Academy home, the classic/snail modes, and Style Studio
- `starship-trilevel-chess.html` — classroom tri-level variant with shared style preference and XP
- `CHANGELOG.md`, `UPLOAD_INSTRUCTIONS.md` — release and deployment details
- `PREVIEWS/` — example UI screenshots

## Classroom verification

After updating the game, choose Classic Chess and open Style Studio. Preview a robot piece and a neon board, then close without earning XP; the locked preview should revert. Complete an opening and a special move to gain XP. Once an item is unlocked, equip it and launch Starship Tri-Level Chess to confirm the shared board and piece theme. Existing opening moves and in-game hints should behave normally.

Browser checks were completed at desktop and mobile widths, including legal opening moves, style previews, an XP/castling progression sequence and shared settings between pages. Rendering may fall back to a perspective 2D canvas on devices where WebGL is restricted.
