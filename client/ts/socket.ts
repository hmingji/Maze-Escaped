import { io } from 'socket.io-client';
import { refreshPlayersState } from './player';

const socket = io(process.env.WS_SERVER ?? 'ws://localhost:3000');
let myPlayerId: number | null = null;

socket.on('disconnect', () => {
  console.log('user disconnected');
});

socket.on('id', (playerId: number) => {
  myPlayerId = playerId;
  console.log('playerId:', playerId);
});

socket.on('p', (serverPlayers) => {
  refreshPlayersState(serverPlayers);
});

export function getMyPlayerId() {
  return myPlayerId;
}
