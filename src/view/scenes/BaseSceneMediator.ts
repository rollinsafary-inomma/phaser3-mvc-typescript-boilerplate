import Game from '../../Game';
import { BaseMediator } from '../base/BaseMediator';
import BaseScene from './BaseScene';
import PopupScene from './PopupScene';

export default abstract class BaseSceneMediator<
  T extends BaseScene,
> extends BaseMediator<T> {
  protected defaultNotifications: string[] = [
    PopupScene.WOKE_NOTIFICATION,
    PopupScene.SLEPT_NOTIFICATION,
  ];

  constructor(name: string, viewComponent: T) {
    super(name, viewComponent);

    if (this.viewComponent) {
      this.registerEvents();
    }
  }

  public onRegister(): void {
    super.onRegister();
    this.subscribeToDefaultNotifications();
  }

  public handleNotification(notificationName: string, ...args: any[]): void {
    this.handleDefaultNotifications(notificationName, ...args);
  }

  public setViewComponent(viewComponent: T): void {
    super.setViewComponent(viewComponent);
    this.setViewComponentListeners();
    this.registerEvents();
  }

  public onRemove(): void {
    this.sceneManager.remove(this.viewComponent.constructor.name);
    super.onRemove();
  }

  protected async startScene(): Promise<void> {
    return new Promise<void>(
      (resolve: (value?: void | PromiseLike<void>) => void) => {
        this.viewComponent.events.once(Phaser.Scenes.Events.START, resolve);
        this.sceneManager.start(this.viewComponent.constructor.name);
      },
    );
  }

  protected async stopScene(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.viewComponent.events.once(Phaser.Scenes.Events.SHUTDOWN, resolve);
      this.sceneManager.stop(this.viewComponent.constructor.name);
    });
  }

  protected setView(): void {}

  protected setViewComponentListeners(): void {
    //
  }

  protected registerEvents(): void {
    this.viewComponent.events.on(
      Phaser.Scenes.Events.START,
      this.onSceneStart,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.READY,
      this.onSceneReady,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.SHUTDOWN,
      this.onSceneStop,
      this,
    );
    this.viewComponent.events.on(
      BaseScene.PLAY_SFX_EVENT,
      this.onPlaySfx,
      this,
    );
    this.viewComponent.events.on(
      BaseScene.STOP_SFX_EVENT,
      this.onStopSfx,
      this,
    );
  }

  protected onSceneStart(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['STARTED_NOTIFICATION'],
    );
  }
  protected onSceneReady(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['READY_NOTIFICATION'],
    );
  }
  protected onSceneStop(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['STOPPED_NOTIFICATION'],
    );
  }

  protected subscribeToDefaultNotifications(): void {
    this.subscribeToNotifications(...this.defaultNotifications);
  }

  protected handleDefaultNotifications(
    notificationName: string,
    ...args: any
  ): void {
    switch (notificationName) {
      case PopupScene.WOKE_NOTIFICATION:
        this.viewComponent.input.enabled = false;
        break;
      case PopupScene.SLEPT_NOTIFICATION:
        this.viewComponent.input.enabled = true;
        break;
      default:
        this.onUnhandledNotification(notificationName);
        break;
    }
  }

  protected onPlaySfx(sfxName: string, loop: boolean): void {
    this.sendNotification(BaseScene.PLAY_SFX_NOTIFICATION, sfxName, loop);
  }
  protected onStopSfx(): void {
    this.sendNotification(BaseScene.STOP_SFX_NOTIFICATION);
  }

  get game(): Game {
    return Game.getInstance();
  }

  get sceneManager(): Phaser.Scenes.SceneManager {
    return this.game.scene;
  }
}
