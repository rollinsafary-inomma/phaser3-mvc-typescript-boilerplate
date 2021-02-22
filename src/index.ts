import 'phaser';
import Game from './Game';
import {
  disableConsoleFunctions,
  disableInspectElement,
  getMode,
} from './utils/Utils';

if (getMode() === 'production') {
  disableConsoleFunctions();
  disableInspectElement();
}

document.title = Game.NAME;

document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
  new Game();
}
