import { io } from 'socket.io-client';
import { CTR_ACTIONS } from './controls';
import { setMap } from './map';
import { refreshPlayersState } from './player';

const socket = io(process.env.WS_SERVER ?? 'ws://localhost:3000');
let myPlayerId: number | null = null;
let lastSentControls = 0;

socket.on('disconnect', () => {
  console.log('user disconnected');
});

socket.on('id', (playerId: number) => {
  myPlayerId = playerId;
});

socket.on('p', (serverPlayers) => {
  refreshPlayersState(serverPlayers);
});

socket.on('map', (serverMap: number[][]) => {
  setMap(serverMap);
});

export function getMyPlayerId() {
  return myPlayerId;
}

export function emitControls(activeControls) {
  const LEFT_BIT = 1 << 0;
  const RIGHT_BIT = 1 << 1;
  const UP_BIT = 1 << 2;
  const DOWN_BIT = 1 << 3;
  let controlByte = 0;
  controlByte |= activeControls[CTR_ACTIONS.LEFT] ? LEFT_BIT : 0;
  controlByte |= activeControls[CTR_ACTIONS.RIGHT] ? RIGHT_BIT : 0;
  controlByte |= activeControls[CTR_ACTIONS.UP] ? UP_BIT : 0;
  controlByte |= activeControls[CTR_ACTIONS.DOWN] ? DOWN_BIT : 0;

  if (controlByte !== lastSentControls) {
    socket.emit('c', controlByte);
    lastSentControls = controlByte;
  }
}
