import { TICK_RATE } from '../../src/constants';
import { ctx, setupCanvas } from './canvas';
import { INTERPOLATION_RATE } from './constants';
import { activeControls, defaultKeymap, setKeymap } from './controls';
import { drawMap } from './map';
import { drawPlayers, updatePlayers } from './player';
import './socket';
import { emitControls } from './socket';

const width = window.innerWidth;
const height = window.innerHeight;
setupCanvas(width, height);

let lastRender = 0;

function draw() {
  ctx.clearRect(0, 0, width, height);
  drawMap(ctx);
  drawPlayers(ctx);
}

function loop(timestamp) {
  const delta = timestamp - lastRender;
  draw();
  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

function startup() {
  setKeymap(defaultKeymap);
  window.requestAnimationFrame(loop);
}

setInterval(() => {
  emitControls(activeControls);
}, 1000 / TICK_RATE);

let lastInterpolationTime = performance.now();
setInterval(() => {
  const now = performance.now();
  const delta = now - lastInterpolationTime;
  updatePlayers(delta);
  lastInterpolationTime = now;
}, 1000 / INTERPOLATION_RATE);

startup();
