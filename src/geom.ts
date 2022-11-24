import { PLAYER_HEIGHT, PLAYER_WIDTH, TILE_SIZE } from './constants';

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

const updateOffset = (
  rect1: TRectangle,
  rect2: TRectangle,
  movementDirection: Direction
) => {
  switch (movementDirection) {
    case 'Right':
      offset.x = rect1.x + rect1.width - rect2.x;
      break;
    case 'Left':
      offset.x = rect2.x + rect2.width - rect1.x;
      break;
    case 'Down':
      offset.y = rect1.height + rect1.y - rect2.y;
      break;
    case 'Up':
      offset.y = rect2.height + rect2.y - rect1.y;
      break;
    default:
  }
};

export const getOffset = () => offset;

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

export const isCollidingWithMap = (player, collidables, movementDirection) => {
  for (const collidable of collidables) {
    if (
      isOverlap(getPlayerBoundingBox(player), getMapBoundingBox(collidable))
    ) {
      updateOffset(
        getPlayerBoundingBox(player),
        getMapBoundingBox(collidable),
        movementDirection
      );
      return true;
    }
  }
  return false;
};
