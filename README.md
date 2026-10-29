# Immortal Snail Chess Academy v2.0

A self-contained, classroom-friendly chess collection that expands the original Immortal Snail Chess 3D (v1.2) into four selectable experiences. The game works in a modern browser with no accounts, downloads, server, API key, images, or fonts required.

## Quick start

1. Open **`index.html`**.
2. Choose a game mode.
3. Choose **Play** to start immediately or **Watch lesson** to see a narrated, step-by-step demonstration that moves real pieces on the board.
4. After the demonstration, select **Finish & play** to start a fresh game. Reopen **Modes & lessons** at any time.

**Important:** Keep both HTML files together in the same folder when using the app locally or on GitHub Pages. The Starship 3D mode opens `starship-trilevel-chess.html`. Hosting `index.html` alone makes that link unavailable.

## Four modes

| Mode | Board | Snails | Opponents | What to learn |
|---|---|---|---|---|
| Classic Chess | 8 × 8 | None | Computer or two local players | Movement, king safety, captures, tactics, special moves |
| Immortal Snail | 8 × 8 perspective/WebGL board | Two immortal snails | Computer or two local players | Chess strategy under unavoidable hazards |
| Hungry Snails | Same perspective board | Adaptive movement and recovery | Computer or two local players | Timing, anticipating dashes and safe positions |
| Starship Tri-Level Chess | 3 fixed 4 × 4 and 4 movable 2 × 2 platforms | None | Two local players | Multilevel reasoning and spatial movement |

### Classic Chess

Normal chess starts with all 32 pieces and White to move. The underlying rules engine includes legal-move highlighting, **castling**, **en passant**, choice of **queen/rook/bishop/knight promotion**, check, checkmate, and stalemate. It also detects insufficient-material draws, automatic fivefold repetition, the automatic 75-move limit, and offers a **Claim draw** control when the 50-move rule or threefold repetition is available.

The special-move help panel explains the setup and updates to an actionable prompt when a special move becomes legal. Standard chess has no immortal snails.

### Original Immortal Snail

The original variant remains available. Two snails begin in the middle of the board and each pursue an opposing king. Snails cannot be captured, pushed, or blocked, **and they destroy any chess piece (including kings) that they enter**. They move once per selected interval, measured in complete rounds of two chess turns. The original default interval is **3 complete rounds**. The existing speed selector still offers 2, 3, 4, or 5 rounds.

The danger panel remains visible, and landing forecasts glow on the board. Students should not expect their pieces to protect them from the snail.

### Hungry Snails — new variant

Three starting difficulty presets are available:

- **Training:** snail tick every 4 complete rounds.
- **Balanced:** snail tick every 3 complete rounds.
- **Frenzy:** snail tick every 2 complete rounds.

Each snail tracks its own hunger and rest independently:

1. At a scheduled snail tick, a snail normally advances one neighboring square toward its target king.
2. If it eats any piece, it **rests for one next scheduled snail tick**.
3. If it moves through **two consecutive scheduled ticks without eating**, it **dashes up to two neighboring squares** on its next tick.
4. During a dash, any piece touched on either square is eaten. A meal resets hunger and sets the rest delay.
5. Snails cannot occupy the other snail's square. Pieces never block their path.

The in-game warning describes the upcoming tick, hunger buildup, and rest state. Threat highlights include **both squares** of a future dash and do not claim an attack is coming when the snail must rest.

### Starship Tri-Level Chess — experimental classroom rules

The three large platforms are fixed at different heights. Four 2 × 2 attack decks are smaller, can travel up or down by one platform level, and can carry a single friendly piece. This takes the player's whole turn. The movement rules are simplified deliberately to make the game easier to teach:

- Pawns, rooks, knights, bishops, queens and kings retain their ordinary **projected** chess directions.
- Sliders can traverse a continuous route with **up to one platform seam/level switch in a move**, and their path cannot pass through occupying pieces.
- Knights can leap to a matching target on another level. Kings move one projected square and cannot move into check.
- An attack deck can travel one level if it contains **exactly one friendly piece**, the destination docking point is free, and moving it does not expose its king to check.
- Pawns reaching the farthest rank promote automatically to a **queen**. **Castling and en passant are not used** in this version.
- The game enforces check, checkmate and stalemate, and also provides Undo, move highlighting, layer focus, and a turn-by-turn guided introduction.

**These are local classroom house rules, NOT a claim to implement an official Star Trek or federation rulebook.** Star Trek's tri-dimensional board is famous but rules were never fully defined in the original television program; fan-authored rule systems differ. This project uses an original, approachable 64-square movement system rather than claiming one of the contested federation standards.

For reference, more comprehensive community rules and examples can be found at:

- [World Tri Dimensional Chess Federation — Laws](https://w3dcf.com/information/laws)
- [Charles Roth — Star Trek 3-D Chess Rules](https://www.thedance.net/~roth/TECHBLOG/chess.html)

The game is an independent educational homage and is not affiliated with or endorsed by Star Trek or its rights holders.

## How tutorials work

**Classic, Original Snail and Hungry Snails** use an optional nine-move walkthrough in their real chess engine. The narration covers pawn movement, knights, bishops, a safe opening and castling. The active snail rules and countdown apply if a snail mode is selected. **Next move**, **Previous**, and **Finish & play** controls let students step through the example and restart a fresh game.

**Starship Tri-Level** has its own six-step walkthrough: identifying the board levels, selecting a piece, demonstrating a knight move, preparing an example attack deck with one piece, moving the deck one level, and reviewing king safety. The special attack-deck position is explicitly a teaching setup; normal play begins with the full 32-piece initial position.

## Classroom notes and controls

- The first three modes support **Computer** and **Two players**; the Starship mode supports **two local players** (no computer opponent yet).
- Drag the regular 3D board to rotate it; scroll to zoom; select the overhead view for easier movement. The original chess pieces retain adjustable color presets.
- The Starship board is a lightweight isometric, interactive SVG with selectable levels, click/touch/keyboard-selectable squares, a basic viewpoint rotation and attack deck shift controls.
- Both games work without external network resources after the HTML files are available.
- All files are plain HTML/CSS/JavaScript; no bundler, external sprites, images, or installation is needed.

## Deployment

Upload **both** `index.html` and `starship-trilevel-chess.html` to the **Immortal Snail Chess** GitHub Pages repository root. Do not upload this game's `index.html` into the **main Naches Learning Hub** repository. The current Learning Hub link should continue to open the updated game at the same published address.

See `UPLOAD_INSTRUCTIONS.md` for a step-by-step GitHub checklist. Screenshots in `PREVIEWS/` are optional and do not need to be deployed.
