import { io } from 'socket.io-client';

const socket = io(process.env.WS_SERVER ?? 'ws://localhost:3000');

socket.on('disconnect', () => {
  console.log('user disconnected');
});
