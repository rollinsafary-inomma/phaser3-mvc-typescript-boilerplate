import { READY_TO_START_NOTIFICATION } from '../../constants/GlobalNotifications';
import BaseSceneMediator from './BaseSceneMediator';
import BootScene from './BootScene';

export default class BootSceneMediator extends BaseSceneMediator<BootScene> {
  public static NAME: string = 'BootSceneMediator';

  constructor() {
    super(BootSceneMediator.NAME, null);
  }

  public registerNotificationInterests(): void {
    this.subscribeToNotifications(READY_TO_START_NOTIFICATION);
  }

  public handleNotification(notificationName: string): void {
    switch (notificationName) {
      case READY_TO_START_NOTIFICATION:
        this.setView();
        break;
      default:
        this.handleDefaultNotifications(notificationName);
        break;
    }
  }

  private async onBootComplete(): Promise<void> {
    this.sceneManager.stop(BootScene.NAME);
    this.sceneManager.remove(BootScene.NAME);
    this.facade.sendNotification(BootScene.BOOT_COMPLETE_NOTIFICATION);
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
