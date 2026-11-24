# Immortal Snail Chess Academy — v2.5 Orbit Grand Edition

**Play:** https://jkramer-cloud.github.io/immortal-snail-chess-3d/

This release adds **Orbit Grand**, a standalone 112-square spherical chess variant, without changing the original Classic, Immortal Snail, Hungry Snails, Starship or 64-square Orbit Chess rules.

## Install

Upload these six files from the `Immortal-Snail-Chess-Academy-v2.5-Grand-GitHub-Ready.zip` package into the **existing** `jkramer-cloud/immortal-snail-chess-3d` GitHub repository:

```text
immortal-snail-chess-3d/
├── index.html                 # REPLACE existing homepage
├── README.md                  # REPLACE existing documentation
└── assets/
    ├── orbit-chess.js         # ADD or REPLACE (64-square Orbit Chess, unchanged v2.4)
    ├── orbit-chess.css        # ADD or REPLACE (64-square Orbit Chess styling, unchanged v2.4)
    ├── orbit-grand.js         # NEW complete Orbit Grand game
    └── orbit-grand.css        # NEW Orbit Grand styling
```

Leave all other files in the repository, including `chess-guide.html`, Starship Chess, and other site assets, in place. The package is cumulative relative to v2.3/v2.4: it includes **both** Orbit game modes and their styles, so you do not need to run a separate upgrade tool.

If using GitHub's **Add file → Upload files**, unzip the archive and upload its contents, preserving the `assets/` subfolder. Commit to the repository's current Pages branch (`main`). Hard refresh the Pages URL after deployment. **Do not upload this ZIP into the PlayForge homepage repository.** The existing PlayForge chess card URL is unchanged.

## Orbit Grand: experimental 112-square rules

The surface contains **eight latitude ranks and fourteen longitude files (A–N)**. The first and last files connect; ranks terminate at the polar caps. The two armies occupy opposing meridians, Black on A and White on H.

Each player receives **24 pieces**: the standard eight back-row pieces (king, queen, two rooks, two knights, two bishops) plus **sixteen pawns**. Eight pawns begin on each side of the player's home meridian. The two pawn fronts advance in **opposite longitude directions** toward the opposing home meridian. White promotes on A, Black promotes on H. Pawns can move one step in their assigned direction, or two on their first move if clear; they capture diagonally into adjacent latitude rows, forward along their pawn front. En passant tracks the exact pawn involved in a two-step move.

Other pieces use familiar chess patterns on the grid, but can wrap horizontally across A/N. The kings must not move into check. **Castling is disabled** in Orbit Grand. Promotions to queen, rook, bishop or knight; check/checkmate; stalemate; basic insufficient-material; the automatic 75-move rule; and fivefold repetition are supported. There is no movement across the polar caps.

These are **original house rules**, inspired by larger spherical chess concepts, not a direct recreation of a published ruleset or a recognized tournament chess variant. Balance and forced-mate properties are not fully established.

## Controls and classroom accessibility

- Drag or swipe to rotate the planet; tap a piece, then a highlighted destination.
- Use arrow keys to rotate with the globe focused. The **Center**, **Other side** and **Selected piece** buttons help recenter.
- Toggle **Globe map** to display a clickable flat 8 × 14 overview, including both hidden sides. Students can also move using that grid.
- Choose **Computer (Black)** with Casual or Strategist, or local two-player. Computer moves trigger an animated camera follow, enabled by default; the follow and return-to-player-view options can be turned off.
- New match and undo are available. The flat map and the sphere use exactly the same legal moves.

## Preservation

- Existing Classic Chess, snail modes, cosmetics, local XP and progress features, rules and Chess Field Guide remain in their original code.
- Existing **64-square Orbit Chess** lives in `assets/orbit-chess.js`, unchanged from v2.4.
- `chess-guide.html` is not modified by this update; keep it on GitHub.
- The original Starship Tri-Level Chess file and links remain unchanged.
- No live server, account, API key, or database is needed. Browser local storage is unchanged for the older game.

## Quality checks

Browser tests passed for the new Grand desktop and mobile layouts, first legal player move, the computer-follow camera, its move history, the 112-cell optional map, mode switching to 64-square Orbit and back to Classic Chess, and no observed JavaScript errors in these test runs. A separate rules harness verified board/piece counts, seam movement, both pawn fronts, four-way promotion on both fronts, en passant victim removal, king safety and 3,114 legal-move outcomes sampled across a 70-ply sequence.

**Not yet verified:** performance on physical school Chromebooks, long-term balance of these custom rules, and every unusual endgame. Test before broad classroom use.
