# Tetro

Retro tetris game.

Play here: https://tetro.onrender.com

## Features

- Retina support
- [SRS](http://tetris.wikia.com/wiki/SRS) (Super Rotation System)
- [DAS](http://tetris.wikia.com/wiki/DAS) (Delayed Auto Shift)
- 7-bag randomizer
- Level based drop speed
- Next piece preview
- "Ghost" preview
- Hard drop
- Scoring
- Local high score
- Count down on resume
- Flexible InputManager based on actions
- Keyboard controls cheatsheet
- Gamepad support (DualShock 4)
- Pause
- Retry
- Mute / Unmute BGM
- Sound effects
- Bitmap font
- Preloader

## Todo

- Center elements on window resize via EventEmitter
- Lock delay
- "Sticky" gravity
- Line clear combos
- Add visual effect for hard drop
- Add visual effect for level up
- Duel mode (2P) via socket.IO
- Write unit tests
- Assets hashing
- Move localStorage interaction to separate module
- Split SoloGameScene into smaller modules
- Pause game on tab change

## CLI

To launch in development mode, clone the repo and run the following:

```
npm install
```

```
npm run dev:web
```

Have fun! 🕹
