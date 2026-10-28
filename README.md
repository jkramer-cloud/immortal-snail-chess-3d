# Immortal Snail Chess 3D

**Play chess. Dodge snails. Survive.**

A self-contained 3D browser chess game where two invincible snails slowly chase the kings. Play a friend on the same device or challenge a computer opponent. Every few rounds, the snails slide closer to their targets, destroying any chess piece they reach.

## Play

Open **`index.html`** in Chrome, Edge, Firefox, or another modern browser. No installation, account, build process, or external dependencies are needed.

To publish on GitHub Pages, upload `index.html` and `README.md` to the root of the `immortal-snail-chess-3d` repository. In **Settings → Pages**, select **Deploy from a branch**, `main`, `/ (root)`. Your game will be at:

`https://YOUR-USERNAME.github.io/immortal-snail-chess-3d/`

## Features

- Correct 32-piece standard starting layout, with fully modeled pieces and a rotatable 3D board.
- A **How Pieces Move** sidebar with mini diagrams and explanations for every piece and the snails.
- Animated **Roll Dice** selection of the opening player. **Odd = White; even = Black.**
- Select **White (traditional)**, **Black (house rule)**, or **Random** under **Who moves first?**. Black-first games deliberately depart from standard chess rules.
- Local two-player and single-player vs. computer modes, including computer-first games.
- Adjustable snail movement speed, animated snail trails and captures, move hints, audio, and visual effects.
- Standard chess movement, including castling, en passant, promotion, check, and checkmate, with snail squares as impassable hazards.
- Independently customizable team colors, with preset palettes and a full color picker.
- Undo, move history, legal destination highlights, overhead camera, drag-to-rotate, and zoom.
- Mobile-responsive layout and a Canvas 2D fallback if WebGL is unavailable.

## How to Play

1. Choose **Computer** or **2 players**, then choose the two teams’ piece colors from the presets or custom color pickers.
2. Choose a snail speed and an opening-player rule. **Roll dice** to start a fresh match with a randomized first player, or select **New match** to follow your selected opening rule.
3. Select a piece, then a highlighted destination. Follow the movement diagrams on the left (on mobile, below the board).
4. The snails move **one square toward their target kings** after the configured number of half-moves. Classic mode moves them after every **six individual chess moves (three rounds)**.
5. Snails cannot be captured or blocked. They destroy pieces they reach, including kings. You can win by checkmate or by a snail catching your opponent's king.

The game begins with snails on the board. Their presence affects otherwise legal opening moves: you cannot land on or move through a snail square.

## Controls

| Action | Control |
| --- | --- |
| Select and move | Click or tap a piece, then its destination |
| Rotate board | Drag |
| Zoom | Mouse wheel |
| Switch camera | **3D**, **Top**, **Flip** |
| Undo | **Undo** |
| See a suggested move | **Hint** |
| Roll first player | **Roll dice** |
| New match | **New match** or **New game** |
| Team colors | **Choose your piece colors**, on the right of the board |

## Version 1.2 — Accurate Controls and Custom Team Colors

- Audited standard legal movement for every chess piece, with dedicated tests for pawn moves and captures, knight jumps, rook/bishop/queen movement, checks, castling, en passant, and promotion.
- Improved 3D click accuracy: the game detects clicks on the raised piece geometry before testing the chessboard surface. This especially helps when selecting a back-rank piece in an angled perspective view.
- Added two independent color controls under **Choose your piece colors**: one for White's team and one for Black's team.
- Choose a preset such as ivory, midnight, sky blue, coral, mint, rose, lavender or gold, or use the custom color picker for any color.
- Color changes apply instantly during play, including the WebGL 3D pieces, the Canvas 2D fallback, and the small team indicators. No restart is needed, and your choices carry through new games in the same session.
- When two teams look too similar in color, the interface provides a contrast warning.
- Expanded the movement guide to clarify that displayed movement patterns assume a clear board; actual legal moves are indicated by destination highlights and can be restricted by other pieces, checks, and snails.

## Version 1.1 Changes

- Fixed a precedence bug in 3D square placement that made pieces overlap or appear missing.
- Added the movement-pattern reference panel.
- Added animated dice rolls and starting-player selection.
- Enabled Black-first turns and corrected move numbering for alternate starts.
- Updated layout and controls for smaller screens.

## Technologies

HTML5, CSS3, JavaScript, WebGL, Canvas 2D, and Web Audio API. The entire game is in a single file.

## Project Notes

The computer opponent is intended for casual classroom and personal play, not tournament-strength competition. Immortal Snail Chess is a house-rule variant; the snail movement and alternate first-player rules are unique to this implementation.

No open-source license has been added. If you want to permit reuse and modification, add a `LICENSE` file with your chosen terms.
