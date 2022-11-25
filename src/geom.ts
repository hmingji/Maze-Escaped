import {
  BULLET_SIZE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  TILE_SIZE,
} from './constants';

type TRectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TDisplacement = {
  x: number;
  y: number;
};

const offset: TDisplacement = {
  x: 0,
  y: 0,
};

export const isOverlap = (rect1: TRectangle, rect2: TRectangle) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  );
};

const getOffset = (
  rect1: TRectangle,
  rect2: TRectangle,
  movementDirection: Direction
) => {
  switch (movementDirection) {
    case 'Right':
      return rect1.x + rect1.width - rect2.x;
    case 'Left':
      return rect2.x + rect2.width - rect1.x;
    case 'Down':
      return rect1.height + rect1.y - rect2.y;
    case 'Up':
      return rect2.height + rect2.y - rect1.y;
    default:
      return 0;
  }
};

//export const getOffset = () => offset;

const getBoundingRectangleFactory =
  (width: number, height: number) => (entity) => {
    return {
      width,
      height,
      x: entity.x,
      y: entity.y,
    } as TRectangle;
  };

export const getPlayerBoundingBox = getBoundingRectangleFactory(
  PLAYER_WIDTH,
  PLAYER_HEIGHT
);

export const getMapBoundingBox = getBoundingRectangleFactory(
  TILE_SIZE,
  TILE_SIZE
);

export const getBulletBoundingBox = getBoundingRectangleFactory(
  BULLET_SIZE,
  BULLET_SIZE
);

export const isCollidingWithMap = (player, collidables) => {
  for (const collidable of collidables) {
    if (
      isOverlap(getPlayerBoundingBox(player), getMapBoundingBox(collidable))
    ) {
      return getOffset(
        getPlayerBoundingBox(player),
        getMapBoundingBox(collidable),
        player.facing
      );
    }
  }
  return null;
};

export const isCollidingWithBullet = (player, bullets) => {
  for (const bullet of bullets) {
    if (isOverlap(getPlayerBoundingBox(player), getBulletBoundingBox(bullet))) {
      return true;
    }
  }
  return null;
};

export const isBulletColliding = (bullet, collidables, players) => {
  for (const collidable of collidables) {
    if (
      isOverlap(getBulletBoundingBox(bullet), getMapBoundingBox(collidable))
    ) {
      return true;
    }
  }
  for (const player of players) {
    if (isOverlap(getBulletBoundingBox(bullet), getPlayerBoundingBox(player))) {
      return true;
    }
  }
  return false;
};
