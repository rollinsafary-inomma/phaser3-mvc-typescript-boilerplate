import PopupManager from '../utils/PopupManager';
import BaseSceneMediator from './BaseSceneMediator';
import PopupScene from './PopupScene';

export default class PopupSceneMediator extends BaseSceneMediator<PopupScene> {
  public static NAME: string = 'PopupSceneMediator';
  protected popupManager: PopupManager;
  constructor(viewComponent?: PopupScene) {
    super(PopupSceneMediator.NAME, viewComponent);
    this.popupManager = PopupManager.getInstance();
  }

  public onRegister(): void {
    super.onRegister();
    this.unsubscribeToNotification(
      PopupScene.WAKE_NOTIFICATION,
      PopupScene.SLEEP_NOTIFICATION,
    );
  }

  public registerNotificationInterests(): void {
    // this.subscribeToNotifications(PreloadScene.LOAD_COMPLETE_NOTIFICATION);
  }

  public handleNotification(notificationName: string, ...args: any[]): void {
    super.handleNotification(notificationName);
    switch (notificationName) {
      // case PreloadScene.LOAD_COMPLETE_NOTIFICATION:
      //   this.registerGamePopups();
      //   break;
      default:
        console.warn(`${notificationName} is unhandled!`);
        break;
    }
  }

  public onSceneReady(): void {}

  public onSceneWake(): void {
    this.sceneManager.bringToTop(PopupScene.NAME);
  }

  public onSceneSleep(): void {
    this.sceneManager.sendToBack(PopupScene.NAME);
  }

  protected setView(): void {
    const popupScene: PopupScene = new PopupScene();
    this.sceneManager.add(PopupScene.NAME, popupScene);
    this.setViewComponent(popupScene);
    this.sceneManager.start(PopupScene.NAME);
    this.sceneManager.sleep(PopupScene.NAME);
    super.setView();
  }

  private registerGamePopups(): void {
    this.sendNotification(PopupScene.REGISTERED_NOTIFICATION);
  }
}
