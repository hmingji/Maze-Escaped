import {
  BULLET_SIZE,
  DIRECTION_DETECT_RANGE,
  GHOST_SIZE,
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

export const getGhostBoundingBox = getBoundingRectangleFactory(
  GHOST_SIZE,
  GHOST_SIZE
);

export const getMapBoundingBox = getBoundingRectangleFactory(
  TILE_SIZE,
  TILE_SIZE
);

export const getBulletBoundingBox = getBoundingRectangleFactory(
  BULLET_SIZE,
  BULLET_SIZE
);

export function isPlayer(player: TPlayer | TGhost): player is TPlayer {
  return (player as TPlayer).bullet !== undefined;
}

export const isCollidingWithMap = (character, collidables) => {
  const characterBoundingBox = isPlayer(character)
    ? getPlayerBoundingBox(character)
    : getGhostBoundingBox(character);

  for (const collidable of collidables) {
    if (isOverlap(characterBoundingBox, getMapBoundingBox(collidable))) {
      return getOffset(
        characterBoundingBox,
        getMapBoundingBox(collidable),
        character.facing
      );
    }
  }
  //console.log('in isColliding function, facing: ', character.facing);
  return null;
};

export const isCollidingWithBullet = (character, bullets) => {
  const characterBoundingBox = isPlayer(character)
    ? getPlayerBoundingBox(character)
    : getGhostBoundingBox(character);

  for (const bullet of bullets) {
    if (isOverlap(characterBoundingBox, getBulletBoundingBox(bullet))) {
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

export function isBulletCollidingWithMap(bullet, collidables) {
  for (const collidable of collidables) {
    if (
      isOverlap(getBulletBoundingBox(bullet), getMapBoundingBox(collidable))
    ) {
      return true;
    }
  }
  return false;
}

export function isBulletCollidingWithPlayers(bullet, players) {
  for (const player of players) {
    if (isOverlap(getBulletBoundingBox(bullet), getPlayerBoundingBox(player))) {
      return true;
    }
  }
  return false;
}

export function isBulletCollidingWithGhosts(bullet, ghosts) {
  for (const ghost of ghosts) {
    if (isOverlap(getBulletBoundingBox(bullet), getGhostBoundingBox(ghost))) {
      return true;
    }
  }
  return false;
}

export function isChangeDirectionAllowed(ghost: TGhost, collidables: TPoint[]) {
  const surroundedCollidables = collidables.filter(
    (c) =>
      ghost.x - 150 < c.x &&
      c.x < ghost.x + 150 &&
      ghost.y - 150 < c.y &&
      c.y < ghost.y + 150
  );
  if (ghost.facing === 'Left' || ghost.facing === 'Right') {
    const ghostDisplacedUpward: TGhost = {
      ...ghost,
      y: ghost.y - DIRECTION_DETECT_RANGE,
    };
    const ghostDisplacedDownward: TGhost = {
      ...ghost,
      y: ghost.y + DIRECTION_DETECT_RANGE,
    };
    let directions: Direction[] = ['Down', 'Up'];
    for (const collidable of surroundedCollidables) {
      if (
        isOverlap(
          getGhostBoundingBox(ghostDisplacedUpward),
          getMapBoundingBox(collidable)
        )
      ) {
        directions = directions.filter((item) => item !== 'Up');
      }
      if (
        isOverlap(
          getGhostBoundingBox(ghostDisplacedDownward),
          getMapBoundingBox(collidable)
        )
      ) {
        directions = directions.filter((item) => item !== 'Down');
      }
    }
    if (directions.length == 0) return null;
    return directions;
  } else if (ghost.facing === 'Up' || ghost.facing === 'Down') {
    const ghostDisplacedLeft: TGhost = {
      ...ghost,
      x: ghost.x - DIRECTION_DETECT_RANGE,
    };
    const ghostDisplacedRight: TGhost = {
      ...ghost,
      x: ghost.x + DIRECTION_DETECT_RANGE,
    };
    let directions: Direction[] = ['Left', 'Right'];
    for (const collidable of surroundedCollidables) {
      if (
        isOverlap(
          getGhostBoundingBox(ghostDisplacedLeft),
          getMapBoundingBox(collidable)
        )
      ) {
        directions = directions.filter((item) => item !== 'Left');
      }
      if (
        isOverlap(
          getGhostBoundingBox(ghostDisplacedRight),
          getMapBoundingBox(collidable)
        )
      ) {
        directions = directions.filter((item) => item !== 'Right');
      }
    }
    if (directions.length == 0) return null;
    return directions;
  }
}
