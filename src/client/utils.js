// eslint-disable-next-line
export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const deg2rad = deg => deg * (Math.PI / 180);
export const rad2deg = rad => rad * (180 / Math.PI);
export const fill2d = (w, h, value) => Array.from({ length: h }, () => Array(w).fill(value));
export const isDefined = value => typeof value !== 'undefined';
