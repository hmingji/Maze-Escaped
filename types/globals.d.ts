declare module '*.png';

type PlayerState = 'Normal' | 'Stunned' | 'Dead';

type GhostState = 'Normal' | 'Stunned';

type Direction = 'Left' | 'Up' | 'Down' | 'Right';

type GunState = 'Ready' | 'Reloading';

type TPlayer = {
  id: number;
  x: number;
  y: number;
  score: number;
  v: number;
  color: string;
  name: string;
  state: PlayerState;
  facing: Direction;
  bullet: number;
  gunState: GunState;
};

type TBullet = {
  id: number;
  x: number;
  y: number;
  travelTo: Direction;
};

type TGhost = {
  id: number;
  x: number;
  y: number;
  score: number;
  v: number;
  color: string;
  state: GhostState;
  facing: Direction;
};

type TPoint = {
  x: number;
  y: number;
};
