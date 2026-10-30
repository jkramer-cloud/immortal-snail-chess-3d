# Immortal Snail Chess Academy v2.2

This GitHub-ready replacement preserves the complete v2.1 game while adding an always-visible experience (XP) tracker, next-unlock progress, matches and wins, and a Resign Match button.

## Upload
1. Open the `jkramer-cloud/immortal-snail-chess-3d` GitHub repository.
2. Select **Add file → Upload files** and replace the root `index.html` with the file from this package.
3. Commit and hard-refresh the GitHub Pages game.

No new repository or Learning Hub update is needed. Do not upload this README unless you wish to replace your existing README.

## Resign
The Resign Match control appears beside the move controls. A confirmation explains the outcome. Against the computer the human White side resigns; in local two-player games the side to move resigns. Resigning awards the opponent the victory, records a match and a resignation, but grants no end-of-match XP. Pending AI moves are canceled. Undo and further moves are disabled until a new match. The Resign button is disabled during lessons and completed games.

## XP
The top bar and Cosmetics & Progress panel show XP, record, and cosmetic unlock progress. Cosmetic data remains in this browser's existing `chess-academy-cosmetics-v21` localStorage record; installing the update does not wipe it. XP is still local to each browser and device.

## Compatibility
Full chess rules, Immortal Snail and Hungry Snail variants, lessons, 3D WebGL board, computer opponent, color customization, cosmetic unlocks, 3D camera, and Starship game links are retained.
