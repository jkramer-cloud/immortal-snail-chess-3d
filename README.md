# Immortal Snail Chess Academy — Chess Field Guide Edition

A non-destructive companion for the existing v2.2 GitHub Pages game.

## Install on GitHub

1. Open **jkramer-cloud/immortal-snail-chess-3d** on GitHub.
2. Select **Add file → Upload files**.
3. Upload these two files from this package into the repository's **root** (beside your existing `index.html`):
   - `academy.html`
   - `chess-guide.html`
4. Optionally replace the existing root `README.md` with this updated documentation.
5. Commit your upload. GitHub Pages will publish the two new pages automatically once deployment completes.
6. Open this URL to play the game with the new lesson buttons and annotated move history:

   `https://jkramer-cloud.github.io/immortal-snail-chess-3d/academy.html`

   Or open the stand-alone reference directly:

   `https://jkramer-cloud.github.io/immortal-snail-chess-3d/chess-guide.html`

**Do not remove, rename, or replace `index.html`.** The companion game page displays the existing `index.html` inside a same-origin frame and adds the student guide and move annotations around it. The original game, its rules, XP, cosmetics, and saves stay untouched.

## What students get

- A visible **Chess Field Guide** button inside the game's header and an **illustrated examples** button in the Special Chess Moves panel.
- 23 step-through lessons with interactive board demonstrations covering en passant, kingside/queenside castling, queen promotion, underpromotion, checks, checkmate, stalemate, draw rules, pawn double steps, forks, pins, skewers, discovered attacks, and common openings.
- Previous, Next, Reset, Auto Play, and clickable move-history steps; keyboard left/right arrows also navigate.
- Opening recognition and explanatory labels beside the existing move tracker, including names such as Italian Game, Ruy Lopez, Sicilian Defense, French Defense, Caro–Kann Defense, Queen's Gambit, King's Gambit, and others.
- Castling, promotion, check, and checkmate annotations when recognizable from the existing UI.
- A toggle to hide the extra labels while leaving normal chess history visible.

## Accuracy and limitations

- The opening recognizer uses **known early move sequences**; many legitimate variations will not receive a label. A single move is not automatically a gambit, and the app does not claim to evaluate move quality with a chess engine.
- The source game renders capture with `×` and does not print `+` or `#` in its own move history. The companion detects check/checkmate using the game's on-screen status, and recognizes castles/promotions from notation.
- **En passant is demonstrated in the guide but is not labeled automatically in live history**, because the original game's move notation does not distinguish it from an ordinary pawn capture. Marking it from notation alone would risk incorrect labels.
- Tactical motifs such as forks and pins are taught in the guide, not automatically detected in live games: proper detection requires checking the actual board position.
- The 2D guide's board is a controlled teaching demonstration, not a second chess game. Its move sequences were checked for standard chess legality, including the example checkmates and stalemate.
- The enhanced page needs to be hosted **alongside `index.html` at the same origin** (GitHub Pages) so it can read and annotate the move tracker. Opening it from a local `file://` path may fail because of browser security settings.
- Your existing Learning Hub link to the repository's default `/` address will still open the old entry page. To make the enhanced edition the default Learning Hub activity, update that hub link to end with `/academy.html`. The stand-alone guide can also be linked on its own.

## Testing before switching students

1. Open `academy.html` on your published GitHub Pages site.
2. Click **Chess Field Guide** and step through the **En passant** lesson. Confirm that the captured pawn vanishes from d5 after White moves e5 to d6.
3. Close the guide, choose **Classic Chess** in the game, and play **1. e4 c5**. The history should identify the **Sicilian Defense**.
4. Try a new match and confirm your XP and cosmetics remain intact.
5. Once you like the result, update the Learning Hub activity URL to the new `academy.html` page.

## Technical note

This is an additive two-page implementation because the latest published `index.html` could be inspected but its bytes were unavailable for a safe direct replacement in this session. A full `index.html` integration is possible when the original file is available. Avoid treating this package as a new copy of the original game engine.
