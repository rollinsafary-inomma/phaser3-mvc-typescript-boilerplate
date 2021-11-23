import { Mediator } from '@rollinsafary/mvc';
import Game from '../../Game';
import { redLog } from '../../utils/Logger';

export abstract class BaseMediator<T> extends Mediator<T> {
  protected onUnhandledNotification(notificationName: string): void {
    redLog(
      `"${notificationName}" notification is not handled in ${this.constructor.name}`,
    );
  }

  get game(): Game {
    return Game.getInstance();
  }

  get sceneManager(): Phaser.Scenes.SceneManager {
    return this.game.scene;
  }
}
