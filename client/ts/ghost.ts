import ghostFUrl from '../images/ghost.png';
import ghostDUrl from '../images/ghost_dead.png';
import { TICK_RATE } from '../../src/constants';
import { Camera } from './camera';
import { GHOST_SIZE } from './constants';
import { TInterpolation } from './player';

let ghosts: TGhost[] = [];

const interpolations: Record<number, TInterpolation> = {};

const ghostImageF = new Image();
ghostImageF.src = ghostFUrl;
const ghostImageD = new Image();
ghostImageD.src = ghostDUrl;

const ghostImageMap = {
  Left: ghostImageF,
  Right: ghostImageF,
  Down: ghostImageF,
  Up: ghostImageF,
};

function drawGhost(
  ctx: CanvasRenderingContext2D,
  ghost: TGhost,
  camera: Camera
) {
  console.log(ghost.x, ghost.y);
  ctx.drawImage(
    ghost.state === 'Normal' ? ghostImageMap[ghost.facing] : ghostImageD,
    0,
    0,
    GHOST_SIZE,
    GHOST_SIZE,
    ghost.x - camera.cx,
    ghost.y - camera.cy,
    GHOST_SIZE,
    GHOST_SIZE
  );
}

export function getGhosts() {
  return ghosts;
}

export function drawGhosts(ctx: CanvasRenderingContext2D, camera: Camera) {
  for (let ghost of ghosts) {
    //console.log(ghost);
    drawGhost(ctx, ghost, camera);
  }
}

export function updateGhosts(delta: number) {
  for (let ghost of ghosts) {
    const target = interpolations[ghost.id];
    if (!target) continue;
    const t = Math.min(1, target.t / (1000 / TICK_RATE));
    ghost.x = ghost.x * (1 - t) + t * target.x;
    ghost.y = ghost.y * (1 - t) + t * target.y;
    target.t += delta;
  }
}

export function refreshGhostsState(ghostStateChanges: TGhost[]) {
  // someone new joined
  for (const ghost of ghostStateChanges) {
    if (!ghosts.find((g) => g.id === ghost.id)) {
      ghosts.push(ghost);
      interpolations[ghost.id] = {
        x: ghost.x ?? 0,
        y: ghost.y ?? 0,
        t: 0,
      };
    }
  }

  // sync players with server state
  for (const ghost of ghostStateChanges) {
    const matchingGhost = ghosts.find((g) => g.id === ghost.id);
    if (!matchingGhost) continue;
    const { id, x, y, ...props } = ghost;
    Object.assign(matchingGhost, props);
    if (y) interpolations[ghost.id].y = y;
    if (x) interpolations[ghost.id].x = x;
    interpolations[ghost.id].t = 0;
  }
}
