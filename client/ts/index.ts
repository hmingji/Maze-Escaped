import { ctx, setupCanvas } from './canvas';
import { drawPlayers } from './player';
import './socket';

const width = window.innerWidth;
const height = window.innerHeight;
setupCanvas(width, height);

let lastRender = 0;

function draw() {
  ctx.clearRect(0, 0, width, height);
  drawPlayers(ctx);
}

function loop(timestamp) {
  const delta = timestamp - lastRender;
  draw();
  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

function startup() {
  window.requestAnimationFrame(loop);
}

startup();
