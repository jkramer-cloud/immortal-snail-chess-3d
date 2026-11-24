# Immortal Snail Chess Academy v2.4 — Orbit Chess (Spherical World)

**Game URL after you upload:** https://jkramer-cloud.github.io/immortal-snail-chess-3d/

This is a cumulative update to the existing **immortal-snail-chess-3d** repository. It adds **Sphere Chess (Orbit Chess)** as a fifth selectable mode, preserving the existing Classic Chess, Immortal Snail, Hungry Snails, Starship Tri-Level link, Field Guide, XP, Style Studio, lessons, and progress features. It is not a new repository and does not require an update to the PlayForge homepage.

## Exactly which files to upload

In `jkramer-cloud/immortal-snail-chess-3d`, using this ZIP:

1. **Replace** the root `index.html`.
2. **Replace** the root `README.md` (this documentation).
3. **Add** `assets/orbit-chess.css` and `assets/orbit-chess.js`, preserving the `assets/` folder name.
4. The included `chess-guide.html` is an **unchanged complete copy** of the currently published guide. You may leave your existing guide file alone; it is included only so this ZIP is a complete reproducible release.
5. Keep every other existing repository file, particularly `starship-trilevel-chess.html`, artwork, saved data and previous assets. Do not delete anything not mentioned above.

The **file locations** should be:

```
immortal-snail-chess-3d/
├── index.html                      REPLACE
├── README.md                       REPLACE
├── chess-guide.html                EXISTING; unchanged
├── assets/
│   ├── orbit-chess.js              NEW
│   └── orbit-chess.css             NEW
└── ... other existing files ...    KEEP
```

**Publish:** Commit the four changed files to `main`; keep your GitHub Pages setting at `main` / root. Hard-refresh the existing game URL once deployment completes. Open **Sphere Chess** in the header or **Modes & lessons → Orbit Chess**.

## Orbit Chess gameplay

- Drag or swipe the planet to rotate, tap a piece, then tap a highlighted destination. Arrow keys rotate when the globe has focus; arrow buttons work on touch devices.
- **Spherical house rules:** 8 files wrap horizontally (A and H touch); ranks 1 and 8 are polar boundaries and do *not* wrap. Rooks, bishops and queens slide along these wrapped files, stopping at blockers. Knights and diagonal pawn captures may cross the A–H seam. This is an experimental variant, *not official FIDE chess*.
- **Standard move protections preserved for this variant:** checked king moves are forbidden; checks and checkmates work with wraparound attacks; standard-side castling, en passant, pawn promotions and basic drawn-position detection are implemented.
- **Computer opponent:** White vs Computer (Black), with Casual and Strategist settings, or local two-player mode. Computer moves are legal under the spherical variant, not ordinary flat-chess rules.
- **Camera follows the computer:** Enabled by default. After White moves, the camera smoothly focuses on the computer's selected piece, follows to its destination, and then returns to the player's central angle (optional). Both follow and return are separately toggleable.
- **Undo / New globe match:** Independent from the original Snail/Classic game. The original chess modes are not changed.
- The sphere is drawn with lightweight canvas-based perspective geometry and stylized pieces; it is not a fully modeled/WebGL chessboard. No third-party libraries, API keys or network connectivity are required after loading the site files.

## Validation performed

- Confirmed base `index.html`, `README.md`, `chess-guide.html` hashes exactly match the live repository versions before this release was built. The original chess game logic was left unchanged.
- Chromium embedded-document smoke tests: initial spherical position has 20 legal moves; tapping a piece selects and highlights destinations; computer moved and camera rotated toward its source then destination before returning to White; mode switching restored Classic Chess; desktop and mobile layouts rendered without page errors.
- Rule tests: A/H seam behavior for rooks, bishops, knights, pawn captures, and en passant; standard castling and four promotion choices; legal move king-safety validation across 2,313 generated move choices with 0 violations.
- **Remaining verification:** Test GitHub Pages after uploading and on an actual school Chromebook (touchscreen, FPS, battery/thermals). Browser smoke tests do not constitute a full chess-engine proof or real-device performance certification.

---

## Earlier v2.3 release notes (unchanged history)

# Immortal Snail Chess Academy — Integrated Field Guide Edition (v2.3)

This update **replaces the existing `index.html`** and adds `chess-guide.html` in the same GitHub repository folder. The original game URL keeps working, including the Naches Learning Hub link.

## Upload to GitHub

1. Open the `immortal-snail-chess-3d` repository.
2. Upload the `index.html` and `chess-guide.html` files from this package to the **root** of the repository. Replace the existing `index.html` when prompted.
3. Upload `README.md` if you want updated documentation.
4. Wait for GitHub Pages to publish and refresh your original game link.

No Learning Hub update is required if it already opens `https://jkramer-cloud.github.io/immortal-snail-chess-3d/`.

## What's new

- **Chess Field Guide** is available in the main game toolbar, the Special Chess Moves panel, and the Move History panel. It opens in an overlay and returns students to their existing match.
- **28 interactive lessons** cover special moves (en passant, castling, promotion), chess outcomes, tactical patterns, and named openings/gambits.
- **Automatic move annotations** appear in move history during actual play (human and computer moves). Names include recognized opening sequences, gambits, en passant, castling, promotion, check, checkmate, and conservatively detected knight/pawn forks, absolute pins, discovered checks, and a smothered mate in classic chess. Click a name for an example when available.
- **Opening recognition panel** names recognized openings as the game progresses. These labels identify documented move patterns; not every move has a unique name.
- Students may toggle annotations on or off; the preference is saved locally.
- The updated file preserves the existing v2.2 core: 3D rendering, modes, snails, computer opponent, Style Studio, saved cosmetics, match/XP logic, rules, and undo mechanics.

## Notes

- The included `academy.html` from the earlier companion package is **not required** and should not replace this update.
- Move-name annotations are teaching references, not a chess-engine evaluation. Opening names only appear for recognized move sequences.
- A separate existing `starship-trilevel-chess.html` is not changed.
- No account or internet service is needed beyond GitHub Pages hosting.
