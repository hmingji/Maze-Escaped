import { Server, Socket } from 'socket.io';
import { CONTROLS, LIMIT_IP, TControlMap } from './constants';
import { createPlayer, getPlayers, removePlayer } from './gameController';
import { isEmpty, pickBy, identity } from 'lodash';
import { getGameMap } from './mapController';

let io: Server;
let nextPlayerId = 0;
const ipSet = new Set<string>();
const playerIdMap: Record<string, number> = {};
const playerMap: Record<string, TPlayer> = {};
const socketMap: Record<string, Socket> = {};
const controlsMap: Record<number, TControlMap> = {};
let lastPlayerStates: any[] = [];

export function getNextPlayerId() {
  return nextPlayerId++;
}

export function getControlsForPlayer(playerId: number) {
  if (!controlsMap[playerId]) {
    controlsMap[playerId] = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
      reload: false,
    };
  }
  return controlsMap[playerId];
}

export function emitPlayers(players: TPlayer[]) {
  const diffs: any[] = [];
  for (let player of players) {
    const lastPlayerState = lastPlayerStates.find((p) => p.id === player.id);
    if (!lastPlayerState) {
      diffs.push(player);
    } else {
      let diff = {
        x: player.x !== lastPlayerState.x ? player.x : undefined,
        y: player.y !== lastPlayerState.y ? player.y : undefined,
        name: player.name !== lastPlayerState.name ? player.name : undefined,
        state:
          player.state !== lastPlayerState.state ? player.state : undefined,
        facing:
          player.facing !== lastPlayerState.facing ? player.facing : undefined,
      };
      diff = pickBy(diff, (value) => value !== undefined);

      if (!isEmpty(diff)) {
        (diff as any).id = player.id;
        diffs.push(diff);
      }
    }
  }
  if (!isEmpty(diffs)) {
    io.emit('p', diffs);
    //console.log(getPlayers());
  }
  lastPlayerStates = players.map((p) => ({ ...p }));
}

export function emitBullets(bullets: TBullet[]) {
  io.emit('bullets', bullets);
}

export const startSocketController = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connect', (socket: Socket) => {
    console.log('a user connected.');

    const ipAddress = (socket.handshake.headers['x-forwarded-for'] ??
      socket.handshake.headers['x-real-ip'] ??
      socket.handshake.address) as string;

    if (LIMIT_IP && ipSet.has(ipAddress)) {
      socket.disconnect();
      return;
    }

    ipSet.add(ipAddress);
    const newPlayerId = getNextPlayerId();
    playerIdMap[socket.id] = newPlayerId;
    const player = createPlayer(newPlayerId);
    playerMap[socket.id] = player;
    socketMap[socket.id] = socket;

    socket.emit('id', newPlayerId);
    socket.emit('p', getPlayers());
    socket.emit('map', getGameMap());

    socket.on('disconnect', () => {
      console.log('a user disconnected');
      ipSet.delete(ipAddress);
      const playerId = playerIdMap[socket.id];
      delete playerMap[socket.id];
      delete playerIdMap[socket.id];
      removePlayer(playerId);

      io.emit('playerLeft', playerId);
    });

    socket.on('shoot', () => {
      const controlMap = getControlsForPlayer(playerIdMap[socket.id]);
      controlMap[CONTROLS.SHOOT] = true;
    });

    socket.on('reload', () => {
      const controlMap = getControlsForPlayer(playerIdMap[socket.id]);
      controlMap[CONTROLS.RELOAD] = true;
    });

    socket.on('c', (controls: number) => {
      const LEFT_BIT = 1 << 0;
      const RIGHT_BIT = 1 << 1;
      const UP_BIT = 1 << 2;
      const DOWN_BIT = 1 << 3;
      const newControls = {
        left: controls & LEFT_BIT,
        right: controls & RIGHT_BIT,
        up: controls & UP_BIT,
        down: controls & DOWN_BIT,
      };

      Object.assign(getControlsForPlayer(playerIdMap[socket.id]), newControls);
    });
  });
};
