import { TICK_RATE } from '../../src/constants';
import bulletUrl from '../images/fireball.png';
import { Camera } from './camera';
import { BULLET_SIZE } from './constants';
import { TInterpolation } from './player';

let bullets: TBullet[] = [];

const interpolations: Record<number, TInterpolation> = {};

const bulletImage = new Image();
bulletImage.src = bulletUrl;

function drawBullet(
  ctx: CanvasRenderingContext2D,
  bullet: TBullet,
  camera: Camera
) {
  ctx.drawImage(
    bulletImage,
    0,
    0,
    BULLET_SIZE,
    BULLET_SIZE,
    bullet.x - camera.cx,
    bullet.y - camera.cy,
    BULLET_SIZE,
    BULLET_SIZE
  );
}

export function removeBullet(bullet: TBullet) {
  bullets = bullets.filter((b) => b.id !== bullet.id);
}

export function drawBullets(ctx: CanvasRenderingContext2D, camera: Camera) {
  for (const bullet of bullets) {
    drawBullet(ctx, bullet, camera);
  }
}

export function updateBullets(delta: number) {
  for (let bullet of bullets) {
    const target = interpolations[bullet.id];
    if (!target) continue;
    const t = Math.min(1, target.t / (1000 / TICK_RATE));
    bullet.x = bullet.x * (1 - t) + t * target.x;
    bullet.y = bullet.y * (1 - t) + t * target.y;
    target.t += delta;
  }
}

export function refreshBulletsState(bulletStateChanges: TBullet[]) {
  // someone new joined
  for (const bullet of bulletStateChanges) {
    if (!bullets.find((b) => b.id === bullet.id)) {
      bullets.push(bullet);
      interpolations[bullet.id] = {
        x: bullet.x ?? 0,
        y: bullet.y ?? 0,
        t: 0,
      };
    }
  }

  // sync players with server state
  for (const bullet of bulletStateChanges) {
    const matchingBullet = bullets.find((b) => b.id === bullet.id);
    if (!matchingBullet) continue;
    const { id, x, y, ...props } = bullet;
    Object.assign(matchingBullet, props);
    if (y) interpolations[bullet.id].y = y;
    if (x) interpolations[bullet.id].x = x;
    interpolations[bullet.id].t = 0;
  }
}
