import { BULLET_SPEED } from './constants';
import {
  getBullets,
  getGhosts,
  getPlayers,
  removeBullet,
} from './gameController';
import {
  isBulletColliding,
  isBulletCollidingWithGhosts,
  isBulletCollidingWithMap,
  isBulletCollidingWithPlayers,
  isCollidingWithBullet,
} from './geom';
import { getCollidables } from './mapController';

export function handleBulletEffect(character: TPlayer | TGhost) {
  const bullets = getBullets();
  if (isCollidingWithBullet(character, bullets)) {
    character.state = 'Stunned';
    setToRecover(character);
  }
}

function setToRecover(character: TPlayer | TGhost) {
  setTimeout(() => {
    if (character.state === 'Stunned') character.state = 'Normal';
  }, 1500);
}

function handleBulletMovement(bullet: TBullet, delta: number) {
  const speed = BULLET_SPEED;
  switch (bullet.travelTo) {
    case 'Right':
      bullet.x += speed * delta;
      break;
    case 'Left':
      bullet.x -= speed * delta;
      break;
    case 'Up':
      bullet.y -= speed * delta;
      break;
    case 'Down':
      bullet.y += speed * delta;
      break;
  }
}

export function handleBulletLogic(bullets: TBullet[], delta: number) {
  for (const bullet of bullets) {
    handleBulletMovement(bullet, delta);
    if (
      isBulletCollidingWithMap(bullet, getCollidables()) ||
      isBulletCollidingWithPlayers(bullet, getPlayers()) ||
      isBulletCollidingWithGhosts(bullet, getGhosts())
    ) {
      removeBullet(bullet);
    }
  }
}
