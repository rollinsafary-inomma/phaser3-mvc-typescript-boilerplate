import BaseScene from './BaseScene';
import BaseSceneMediator from './BaseSceneMediator';
import ServiceScene from './ServiceScene';

export default class ServiceSceneMediator extends BaseSceneMediator<
  ServiceScene
> {
  public static NAME: string = 'ServiceSceneMediator';

  constructor() {
    super(ServiceSceneMediator.NAME, null);
  }

  public registerNotificationInterests(): void {
    this.subscribeToNotifications(
      BaseScene.PLAY_SFX_NOTIFICATION,
      BaseScene.STOP_SFX_NOTIFICATION,
    );
  }

  public handleNotification(notificationName: string, ...args: any[]): void {
    this.handleDefaultNotifications(notificationName, ...args);
    switch (notificationName) {
      case BaseScene.PLAY_SFX_NOTIFICATION:
        {
          const sfxName: string = args[0];
          this.viewComponent.playSFX(sfxName);
        }
        break;
      case BaseScene.STOP_SFX_NOTIFICATION:
        this.viewComponent.stopSFX();
        break;
      default:
        break;
    }
  }

  protected onSceneDestroy(): void {
    super.onSceneDestroy();
    this.facade.removeMediator(ServiceSceneMediator.NAME, this.id);
  }

  protected setView(): void {
    const serviceScene: ServiceScene = new ServiceScene();
    this.sceneManager.add(ServiceScene.NAME, serviceScene);
    this.setViewComponent(serviceScene);
    super.setView();
    this.sceneManager.start(ServiceScene.NAME);
  }

  protected setViewComponentListeners(): void {
    this.viewComponent.game.events.on(
      Phaser.Core.Events.PAUSE,
      this.onPause,
      this,
    );
    this.viewComponent.game.events.on(
      Phaser.Core.Events.RESUME,
      this.onResume,
      this,
    );
  }

  private onPause(): void {
    this.sendNotification(ServiceScene.GAME_PAUSED_NOTIFICATION);
  }
  private onResume(): void {
    this.sendNotification(ServiceScene.GAME_RESUMED_NOTIFICATION);
  }
}
