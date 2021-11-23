import { Facade } from '@rollinsafary/mvc';
import 'phaser';
import Game from './Game';
import GameFacade from './GameFacade';

document.title = Game.NAME;

document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
  Facade.getInstance = GameFacade.getInstance;
  new Game();
}
