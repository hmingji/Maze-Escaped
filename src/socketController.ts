import { Server, Socket } from 'socket.io';
import { LIMIT_IP } from './constants';

let io;
const ipSet = new Set<string>();

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

    socket.on('disconnect', () => {
      console.log('a user disconnected');
      ipSet.delete(ipAddress);
    });
  });
};
