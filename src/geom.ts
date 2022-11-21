import { PLAYER_HEIGHT, PLAYER_WIDTH, TILE_SIZE } from './constants';

type TRectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const isOverlap = (rect1: TRectangle, rect2: TRectangle) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  );
};

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

export const isCollidingWithMap = (player, collidables) => {
  for (const collidable of collidables) {
    if (
      isOverlap(getPlayerBoundingBox(player), getMapBoundingBox(collidable))
    ) {
      return true;
    }
  }
  return false;
};
