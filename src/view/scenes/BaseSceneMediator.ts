import { Mediator } from '@candywings/pure-mvc';
import Game from '../../Game';
import GameFacade from '../../GameFacade';
import { getScene, postRunnable } from '../utils/phaser/PhaserUtils';
import BaseScene from './BaseScene';
import PopupScene from './PopupScene';
import ServiceScene from './ServiceScene';

export default abstract class BaseSceneMediator<
  T extends BaseScene
> extends Mediator<T> {
  protected defaultNotifications: string[] = [
    PopupScene.WAKE_NOTIFICATION,
    PopupScene.SLEEP_NOTIFICATION,
  ];

  constructor(name: string, viewComponent: T) {
    super(name, viewComponent);

    if (this.viewComponent) {
      this.registerEvents();
    }
  }

  public handleNotification(notificationName: string, ...args: any[]): void {
    this.handleDefaultNotifications(notificationName);
  }

  public setViewComponent(viewComponent: T): void {
    super.setViewComponent(viewComponent);
    this.setViewComponentListeners();
    this.registerEvents();
  }

  public onRegister(): void {
    this.setView();
    this.subscribeToDefaultNotifications();
    super.onRegister();
  }

  public onRemove(): void {
    this.sceneManager.remove(this.viewComponent.constructor.name);
    super.onRemove();
  }

  protected async startScene(): Promise<void> {
    return new Promise<void>(
      (resolve: (value?: void | PromiseLike<void>) => void) => {
        if (this.sceneManager.isActive(this.viewComponent.constructor.name)) {
          return;
        }
        postRunnable(() => {
          this.sceneManager.start(this.viewComponent.constructor.name);
          resolve();
        });
      },
    );
  }

  protected async stopScene(): Promise<void> {
    this.sceneManager.stop(this.viewComponent.constructor.name);
  }

  protected setView(): void {
    //
  }

  protected setViewComponentListeners(): void {
    //
  }

  protected registerEvents(): void {
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
      Phaser.Scenes.Events.PAUSE,
      this.onScenePause,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.RESUME,
      this.onSceneResume,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.SLEEP,
      this.onSceneSleep,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.WAKE,
      this.onSceneWake,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.TRANSITION_INIT,
      this.onSceneTransitionInit,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.TRANSITION_COMPLETE,
      this.onSceneTransitionComplete,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.TRANSITION_OUT,
      this.onSceneTransitionOut,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.SHUTDOWN,
      this.onSceneShutdown,
      this,
    );
    this.viewComponent.events.on(
      Phaser.Scenes.Events.DESTROY,
      this.onSceneDestroy,
      this,
    );
  }

  protected registerPreUpdateEvent(): void {
    this.viewComponent.events.on(
      Phaser.Scenes.Events.PRE_UPDATE,
      this.onScenePreUpdate,
      this,
    );
  }

  protected registerUpdateEvent(): void {
    this.viewComponent.events.on(
      Phaser.Scenes.Events.UPDATE,
      this.onSceneUpdate,
      this,
    );
  }

  protected registerPostUpdateEvent(): void {
    this.viewComponent.events.on(
      Phaser.Scenes.Events.POST_UPDATE,
      this.onScenePostUpdate,
      this,
    );
  }

  protected onSceneStart(): void {
    this.sendNotification((this.viewComponent.constructor as any)['START']);
  }

  protected onSceneReady(): void {
    this.sendNotification((this.viewComponent.constructor as any)['READY']);
  }

  protected onScenePreUpdate(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['PRE_UPDATE'],
    );
  }

  protected onSceneUpdate(): void {
    this.sendNotification((this.viewComponent.constructor as any)['UPDATE']);
  }

  protected onScenePostUpdate(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['POST_UPDATE'],
    );
  }

  protected onScenePause(): void {
    this.sendNotification((this.viewComponent.constructor as any)['PAUSE']);
  }

  protected onSceneResume(): void {
    this.sendNotification((this.viewComponent.constructor as any)['RESUME']);
  }

  protected onSceneSleep(): void {
    this.sendNotification((this.viewComponent.constructor as any)['SLEEP']);
  }

  protected onSceneWake(): void {
    // this.viewComponent.showBackground();
    this.sendNotification((this.viewComponent.constructor as any)['WAKE']);
  }

  protected onSceneTransitionInit(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['TRANSITION_INIT'],
    );
  }

  protected onSceneTransitionComplete(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['TRANSITION_COMPLETE'],
    );
  }

  protected onSceneTransitionOut(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['TRANSITION_OUT'],
    );
  }

  protected onSceneShutdown(): void {
    this.sendNotification((this.viewComponent.constructor as any)['SHUTDOWN']);
  }

  protected onSceneDestroy(): void {
    this.sendNotification((this.viewComponent.constructor as any)['DESTROY']);
  }

  protected async fadeScreenOut(
    color: number = 0x0000000,
    duration: number = 500,
    delay: number = 0,
    wait: boolean = false,
  ): Promise<void> {
    const serviceScene: ServiceScene = getScene(ServiceScene.NAME);
    this.sceneManager.bringToTop(serviceScene);
    wait && (await serviceScene.fadeInPromise);
    return serviceScene.screenFadeOut(color, duration, delay);
  }
  protected async fadeScreenIn(
    duration: number = 300,
    delay: number = 0,
    wait: boolean = false,
  ): Promise<void> {
    const serviceScene: ServiceScene = getScene(ServiceScene.NAME);
    this.sceneManager.bringToTop(serviceScene);
    wait && (await serviceScene.fadeOutPromise);
    return serviceScene.screenFadeIn(duration, delay);
  }

  protected subscribeToDefaultNotifications(): void {
    this.subscribeToNotifications(...this.defaultNotifications);
  }

  protected handleDefaultNotifications(
    notificationName: string,
    ...args: any
  ): void {
    switch (notificationName) {
      case PopupScene.WAKE_NOTIFICATION:
        if (this.sceneManager.isActive(this.viewComponent.constructor.name)) {
          this.viewComponent.input.enabled = false;
        }
        break;
      case PopupScene.SLEEP_NOTIFICATION:
        if (this.sceneManager.isActive(this.viewComponent.constructor.name)) {
          this.viewComponent.input.enabled = true;
        }
        break;
      default:
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
    return GameFacade.game as Game;
  }

  get sceneManager(): Phaser.Scenes.SceneManager {
    return this.game.scene;
  }
}
