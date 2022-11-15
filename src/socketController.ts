import { Server, Socket } from 'socket.io';
import { LIMIT_IP } from './constants';
import { createPlayer } from './gameController';

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

    socket.on('disconnect', () => {
      console.log('a user disconnected');
      ipSet.delete(ipAddress);
      const playerId = playerIdMap[socket.id];
      delete playerMap[socket.id];
      delete playerIdMap[socket.id];

      io.emit('playerLeft', playerId);
    });
  });
};
