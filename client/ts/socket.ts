import { io } from 'socket.io-client';
import { GAME_STATE } from '../../src/gameController';
import { refreshBulletsState, removeBullet } from './bullet';
import { CTR_ACTIONS } from './controls';
import { setGameState } from './game';
import { refreshGhostsState } from './ghost';
import { setGameMessage, setTimeLeft } from './hud';
import { setMap } from './map';
import { getPlayers, refreshPlayersState } from './player';

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

socket.on('bullets', (serverBullets) => {
  refreshBulletsState(serverBullets);
});

socket.on('bulletRemoved', (bulletRemoved) => {
  removeBullet(bulletRemoved);
});

socket.on('ghosts', (serverGhosts) => {
  refreshGhostsState(serverGhosts);
});

socket.on('map', (serverMap: number[][]) => {
  setMap(serverMap);
});

socket.on('winner', (winner: TPlayer | null) => {
  const players = getPlayers();
  const alivePlayer = players.filter((p) => p.state !== 'Dead').length;

  if (winner) {
    setGameMessage(
      `${winner.name} has won the game!🎉🎉🎉 Restarting game in few seconds...`
    );
  } else if (alivePlayer <= 0) {
    setGameMessage('All players dead😥 Restarting game in few seconds...');
  } else {
    setGameMessage('Time out!⏱ Restarting game in few seconds...');
  }
});

socket.on('gameState', (gameState: GAME_STATE) => {
  setGameState(gameState);
});

socket.on('timeLeft', (timeLeft: number) => {
  setTimeLeft(timeLeft);
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

  if (activeControls[CTR_ACTIONS.SHOOT]) {
    socket.emit('shoot', null);
  }

  if (activeControls[CTR_ACTIONS.RELOAD]) {
    socket.emit('reload', null);
  }
}
