let assets = [];

if (window.devicePixelRatio > 1) {
  assets = [
    ...assets,
    { name: 'block', url: 'assets/block@2x.png' },
    { name: 'grid_inner', url: 'assets/grid_inner@2x.png' },
    { name: 'grid_outer', url: 'assets/grid_outer@2x.png' },
    { name: 'sf_alien_encounters', url: 'assets/sf_alien_encounters@2x.xml' }
  ];
} else {
  assets = [
    ...assets,
    { name: 'block', url: 'assets/block.png' },
    { name: 'grid_inner', url: 'assets/grid_inner.png' },
    { name: 'grid_outer', url: 'assets/grid_outer.png' },
    { name: 'sf_alien_encounters', url: 'assets/sf_alien_encounters.xml' }
  ];
}

export default assets;
