# Immortal Snail Chess 3D 🐌♟️

**Play chess. Dodge snails. Survive.**

Immortal Snail Chess 3D is a browser-based chess game with a dangerous twist: two indestructible snails slowly pursue the opposing kings. You still need to play chess, but now every move brings the snails closer. Outmaneuver your opponent, avoid the snails' path, and survive the royal chase!

## Features

- **Interactive 3D chessboard** with lighting, sculpted pieces, camera rotation, and zoom.
- **Animated immortal snails** that advance toward the opposing kings and destroy pieces they reach.
- **Single-player mode** against a computer opponent.
- **Local two-player mode** on the same device.
- **Adjustable snail speed**: Fast (2 rounds), Classic (3 rounds), Relaxed (4 rounds), or Slow (5 rounds) between advances.
- **Visual effects and synthesized sound** for moves, captures, and snail attacks.
- **Move hints**, legal-move highlights, move history, and undo.
- **Standard chess moves** including castling, en passant, and pawn promotion, with the snails acting as impassable hazards.
- **Snail landing warnings** that can be enabled or disabled.
- **Responsive layout** for desktops and smaller screens, plus a perspective-rendered fallback for browsers without WebGL.
- **No installation, accounts, or external libraries required.**

## How to Play

1. Select one of your chess pieces, then select a highlighted destination to move.
2. Follow normal chess rules while keeping an eye on the snails.
3. After a set number of complete rounds, **both snails advance one square** toward their target kings. The default is **every three complete rounds** (six individual turns).
4. The snails **cannot be captured**. Chess pieces cannot move onto or through their squares, and the snails destroy pieces they reach.
5. Win by **checkmating your opponent** or by having a snail catch the opposing king.

> **Tip:** Enable **Snail landing hints** to see the glowing squares the snails are expected to move toward next.

## Controls

| Action | Control |
| --- | --- |
| Select a piece / move | Click or tap a piece, then its destination |
| Rotate the camera | Drag the board |
| Zoom | Mouse wheel / supported touch gestures |
| Change camera angle | Use the **3D** or **Top** view buttons |
| Undo a move | **Undo** button |
| Show a suggested move | **Hint** button |
| Toggle audio | **Sound** button |
| Start over / change settings | Set your options, then choose **New game** |

## Play Locally

1. Download or clone this repository.
2. Open `immortal_snail_chess_3d.html` in a modern browser such as Chrome, Edge, or Firefox.
3. Choose **Computer** or **2 players**, set the snail speed, and start playing.

The game is self-contained in one HTML file. **No build process, server, or internet connection is needed.**

## Publish with GitHub Pages

To make the game playable from a GitHub Pages website:

1. Upload `immortal_snail_chess_3d.html` and this `README.md` to your repository.
2. **Rename the HTML file to `index.html`** so it becomes the website's home page.
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder, then save.
6. Once GitHub Pages finishes publishing, open your repository's Pages URL to play.

The published URL normally follows this pattern:

`https://YOUR-USERNAME.github.io/immortal-snail-chess-3d/`

Replace `YOUR-USERNAME` with your GitHub username. The repository name in the URL must match the actual repository name.

## Project Structure

```text
immortal-snail-chess-3d/
├── immortal_snail_chess_3d.html   # Complete game (rename to index.html for GitHub Pages)
└── README.md                      # Project information and instructions
```

## Built With

- **HTML5** — page structure and game interface
- **CSS3** — styling and responsive layout
- **JavaScript** — chess logic, computer opponent, animations, and effects
- **WebGL** — real-time 3D board and models
- **Canvas 2D** — fallback rendering when WebGL is unavailable
- **Web Audio API** — synthesized sound effects

All game code is contained in the HTML file; there are no third-party runtime dependencies.

## Current Version and Future Ideas

This is an early playable version. Possible additions include more detailed piece and snail animations, alternate boards, computer difficulty settings, special game modes, and improved accessibility and touch controls.

The computer opponent is intended for casual play rather than tournament-strength chess.

## License

No license has been added to this repository yet. If you intend to allow others to reuse or modify the code, choose and add an appropriate `LICENSE` file.
