import bulletUrl from '../images/fireball.png';
import { Camera } from './camera';
import { BULLET_SIZE } from './constants';

let bullets: TBullet[] = [];

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

export function drawBullets(ctx: CanvasRenderingContext2D, camera: Camera) {
  for (const bullet of bullets) {
    drawBullet(ctx, bullet, camera);
  }
}

export function updateBullets(serverBullets: TBullet[]) {
  bullets = serverBullets;
}
