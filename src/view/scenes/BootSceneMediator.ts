import BaseSceneMediator from './BaseSceneMediator';
import BootScene from './BootScene';

export default class BootSceneMediator extends BaseSceneMediator<BootScene> {
  public static NAME: string = 'BootSceneMediator';

  constructor() {
    super(BootSceneMediator.NAME, null);
  }

  public registerNotificationInterests(): void {
    this.subscribeToNotifications();
  }

  public handleNotification(notificationName: string): void {
    this.handleDefaultNotifications(notificationName);
    switch (notificationName) {
      default:
        console.warn(`${notificationName} is unhandled!`);
        break;
    }
  }

  protected onSceneDestroy(): void {
    super.onSceneDestroy();
    this.facade.removeMediator(BootSceneMediator.NAME, this.id);
  }

  private async onBootComplete(): Promise<void> {
    await this.fadeScreenOut();
    // this.sceneManager.stop(BootScene.NAME);
    // this.sceneManager.remove(BootScene.NAME);
    // this.facade.sendNotification(BootScene.BOOT_COMPLETE_NOTIFICATION);
  }

  protected setView(): void {
    const bootScene: BootScene = new BootScene();
    this.sceneManager.add(BootScene.NAME, bootScene);
    this.setViewComponent(bootScene);
    this.viewComponent.events.on(
      BootScene.BOOT_COMPLETE_EVENT,
      this.onBootComplete,
      this,
    );
    this.sceneManager.start(BootScene.NAME);
  }

  protected setViewComponentListeners(): void {
    super.setViewComponentListeners();
    this.viewComponent.events.on(
      BootScene.LOAD_COMPLETE_EVENT,
      this.onBootComplete,
      this,
    );
  }
}
