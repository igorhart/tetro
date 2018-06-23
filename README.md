# Tetro

Retro tetris game.

Play here: https://tetro.herokuapp.com/

## Features

- Retina support
- [SRS](http://tetris.wikia.com/wiki/SRS) (Super Rotation System)
- [DAS](http://tetris.wikia.com/wiki/DAS) (Delayed Auto Shift)
- 7-bag randomizer
- Hard drop
- Level based drop speed
- Next piece preview
- Scoring
- Local high score
- Count down on resume
- Flexible InputManager based on actions
- Keyboard controls cheatsheet
- Pause
- Retry
- Mute / Unmute BGM
- Sound effects
- Bitmap font
- Preloader

## Todo

- Center elements on window resize via EventEmitter
- Pause game on tab change
- Write unit tests
- DualShock 4 support via Gamepad API
- Implement "sticky" gravity
- Implement line clear combos
- Add visual effect for hard drop
- Add visual effect for level up
- Assets hashing
- Move localStorage interaction to separate module
- Split SoloGameScene into smaller modules
- Duel mode (2P) via socket.IO

## CLI

To launch in development mode, clone the repo and run script:

```
npm run dev:web
```

Have fun! 🕹
