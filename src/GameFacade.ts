import { Facade } from '@rollinsafary/mvc';
import { STARTUP_NOTIFICATION } from './constants/GlobalNotifications';
import StartupCommand from './controller/StartupCommand';
import Game from './Game';

const consoleArgs: string[] = [
  ``,
  `background: ${'#c8c8ff'}`,
  `background: ${'#9696ff'}`,
  `color: ${'#ffffff'}; background: ${'#0000ff'};`,
  `background: ${'#9696ff'}`,
  `background: ${'#c8c8ff'}`,
];

export default class GameFacade extends Facade {
  public static game: Game;

  public static getInstance(key: string): GameFacade {
    if (!Facade.instanceMap[key]) {
      const instance: GameFacade = new GameFacade(key);
      Facade.instanceMap[key] = instance;
    }
    return Facade.instanceMap[key] as GameFacade;
  }

  public sendNotification(notificationName: string, ...args: any[]): void {
    consoleArgs[0] = `%c %c %c ${notificationName}${
      args.length > 0 ? ' | ' + args : ''
    } %c %c `;
    console.log.apply(console, consoleArgs);
    super.sendNotification(notificationName, ...args);
  }

  protected initializeModel(): void {
    super.initializeModel();
  }

  protected initializeController(): void {
    super.initializeController();
    this.registerCommand(STARTUP_NOTIFICATION, StartupCommand);
  }

  protected initializeView(): void {
    super.initializeView();
  }

  public startup(): void {}
}
