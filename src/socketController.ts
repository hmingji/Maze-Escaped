import { Server, Socket } from 'socket.io';
import { LIMIT_IP } from './constants';
import { createPlayer, getPlayers, removePlayer } from './gameController';
import { isEmpty, pickBy, identity } from 'lodash';

let io: Server;
let nextPlayerId = 0;
const ipSet = new Set<string>();
const playerIdMap: Record<string, number> = {};
const playerMap: Record<string, TPlayer> = {};
const socketMap: Record<string, Socket> = {};
let lastPlayerStates: any[] = [];

export function getNextPlayerId() {
  return nextPlayerId++;
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
  }
  lastPlayerStates = players.map((p) => ({ ...p }));
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

    socket.on('disconnect', () => {
      console.log('a user disconnected');
      ipSet.delete(ipAddress);
      const playerId = playerIdMap[socket.id];
      delete playerMap[socket.id];
      delete playerIdMap[socket.id];
      removePlayer(playerId);

      io.emit('playerLeft', playerId);
    });
  });
};
