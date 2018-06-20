let assets = [
  {
    name: 'count',
    url: 'assets/audio/count.wav'
  },
  {
    name: 'clear',
    url: 'assets/audio/clear.mp3'
  },
  {
    name: 'game_over',
    url: 'assets/audio/game_over.wav'
  },
  {
    name: 'lock',
    url: 'assets/audio/lock.mp3'
  },
  {
    name: 'pause',
    url: 'assets/audio/pause.wav'
  },
  {
    name: 'rotate',
    url: 'assets/audio/rotate.mp3'
  },
  {
    name: 'shift',
    url: 'assets/audio/shift.wav'
  }
];

if (window.devicePixelRatio > 1) {
  assets = [
    ...assets,
    { name: 'block', url: 'assets/textures/block@2x.png' },
    { name: 'grid_inner', url: 'assets/textures/grid_inner@2x.png' },
    { name: 'grid_outer', url: 'assets/textures/grid_outer@2x.png' },
    { name: 'sf_alien_encounters', url: 'assets/fonts/sf_alien_encounters@2x.xml' }
  ];
} else {
  assets = [
    ...assets,
    { name: 'block', url: 'assets/textures/block.png' },
    { name: 'grid_inner', url: 'assets/textures/grid_inner.png' },
    { name: 'grid_outer', url: 'assets/textures/grid_outer.png' },
    { name: 'sf_alien_encounters', url: 'assets/fonts/sf_alien_encounters.xml' }
  ];
}

export default assets;
