import { Facade } from '@candywings/pure-mvc';
import StartupCommand from './controller/StartupCommand';
import Game from './Game';
import BootSceneMediator from './view/scenes/BootSceneMediator';
import PopupSceneMediator from './view/scenes/PopupSceneMediator';
import ServiceSceneMediator from './view/scenes/ServiceSceneMediator';

const consoleArgs: string[] = [
  ``,
  `background: ${'#c8c8ff'}`,
  `background: ${'#9696ff'}`,
  `color: ${'#ffffff'}; background: ${'#0000ff'};`,
  `background: ${'#9696ff'}`,
  `background: ${'#c8c8ff'}`,
];

export default class GameFacade extends Facade {
  public static NAME: string = `GameFacade`;
  public static STARTUP_NOTIFICATION: string = `${GameFacade.NAME}StartUpNotification`;
  public static RESTART: string = `${GameFacade.NAME}RestartNotification`;
  public static NO_LOGIN_INFORMATION_NOTIFICATION: string = `${GameFacade.NAME}NoLoginInformationNotification`;
  public static LOGIN_SERVICE_SIGH_IN_SUCCESS_NOTIFICATION: string = `${GameFacade.NAME}LoginServiceSignInSuccessNotification`;
  public static LOGIN_SERVICE_SIGH_IN_FAIL_NOTIFICATION: string = `${GameFacade.NAME}LoginServiceSignInFailNotification`;
  public static BACK_BUTTON_CLICKED_NOTIFICATION: string = `${GameFacade.NAME}BackButtonClickedNotification`;

  public static game: Game;

  public static getInstance(key: string): GameFacade {
    if (!Facade.instanceMap[key]) {
      const instance: GameFacade = new GameFacade(key);
      Facade.instanceMap[key] = instance;
    }
    return Facade.instanceMap[key] as GameFacade;
  }
  public static onMobileBackButtonClick(): void {
    this.getInstance(Game.NAME).sendNotification(
      GameFacade.BACK_BUTTON_CLICKED_NOTIFICATION,
    );
  }

  public initializeFacade(): void {
    GameFacade.game.events.once(Phaser.Core.Events.READY, this.ready, this);
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
    this.registerCommand(GameFacade.STARTUP_NOTIFICATION, StartupCommand);
  }

  protected initializeView(): void {
    super.initializeView();
    this.registerMediator(new ServiceSceneMediator());
    this.registerMediator(new PopupSceneMediator());
    this.registerMediator(new BootSceneMediator());
  }

  private startup(): void {
    this.sendNotification(GameFacade.STARTUP_NOTIFICATION);
  }

  private ready(): void {
    super.initializeFacade();
    this.startup();
  }
}
