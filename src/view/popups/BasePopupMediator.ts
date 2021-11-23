import { gameConfig } from '../../constants/GameConfig';
import { BaseMediator } from '../base/BaseMediator';
import PopupManager from '../utils/PopupManager';
import BasePopup from './BasePopup';

export default abstract class BasePopupMediator<
  T extends BasePopup
> extends BaseMediator<T> {
  protected popupManager: PopupManager;
  constructor(name: string) {
    super(name, null);
  }

  public onRegister(): void {
    this.popupManager = PopupManager.getInstance();
    super.onRegister();
  }

  public handleNotification(notificationName: string): void {
    this.onUnhandledNotification(notificationName);
  }

  protected createView(viewComponent?: T): void {
    this.setViewComponent(viewComponent);
    this.setViewComponentListeners();
    this.registerEvents();
  }

  public showView(
    x: number = gameConfig.canvasWidth * 0.5,
    y: number = gameConfig.canvasHeight * 0.5,
    ...args: any[]
  ): void {
    this.popupManager.show(this, x, y, ...args);
  }

  public async prepareToShow(
    x: number = gameConfig.canvasWidth * 0.5,
    y: number = gameConfig.canvasHeight * 0.5,
    ...args: any[]
  ): Promise<void> {
    if (this.viewComponent && this.viewComponent.isAlivePromise) {
      await this.viewComponent.isAlivePromise;
    }
    this.createView();
    this.viewComponent.prepareToShow(x, y, ...args);
  }

  public hideView(actionId?: number, ...args: any[]): void {
    !!this.viewComponent && this.popupManager.hide(actionId);
  }

  protected onAction(actionId?: number, ...args: any[]): void {
    this.hideView(actionId);
  }

  protected onViewShow(): void {
    this.sendNotification(
      BasePopup.SHOW_START_NOTIFICATION,
      this.viewComponent.constructor.name,
    );
  }
  protected onViewShowComplete(): void {
    this.sendNotification(
      BasePopup.SHOW_COMPLETE_NOTIFICATION,
      this.viewComponent.constructor.name,
    );
  }
  protected onViewHide(): void {
    this.sendNotification(
      BasePopup.HIDE_START_NOTIFICATION,
      this.viewComponent.constructor.name,
    );
  }
  protected onViewHideComplete(...args: any[]): void {
    this.sendNotification(
      BasePopup.HIDE_COMPLETE_NOTIFICATION,
      this.viewComponent.constructor.name,
    );
  }

  protected setViewComponentListeners(): void {
    //
  }

  protected removeViewComponentListeners(): void {
    //
  }

  protected registerEvents(): void {
    this.viewComponent.on(BasePopup.SHOW_START_EVENT, this.onViewShow, this);
    this.viewComponent.on(
      BasePopup.SHOW_COMPLETE_EVENT,
      this.onViewShowComplete,
      this,
    );
    this.viewComponent.on(BasePopup.HIDE_START_EVENT, this.onViewHide, this);
    this.viewComponent.on(
      BasePopup.HIDE_COMPLETE_EVENT,
      this.onViewHideComplete,
      this,
    );
    this.viewComponent.on(BasePopup.ACTION_EVENT, this.onAction, this);
    this.viewComponent.on(
      Phaser.GameObjects.Events.DESTROY,
      this.onViewComponentDestroy,
      this,
    );
  }

  protected removeEvents(): void {
    this.viewComponent.off(BasePopup.SHOW_START_EVENT, this.onViewShow, this);
    this.viewComponent.off(
      BasePopup.SHOW_COMPLETE_EVENT,
      this.onViewShowComplete,
      this,
    );
    this.viewComponent.off(BasePopup.HIDE_START_EVENT, this.onViewHide, this);
    this.viewComponent.off(
      BasePopup.HIDE_COMPLETE_EVENT,
      this.onViewHideComplete,
      this,
    );
    this.viewComponent.off(BasePopup.ACTION_EVENT, this.onAction, this);
    this.viewComponent.off(
      Phaser.GameObjects.Events.DESTROY,
      this.onViewComponentDestroy,
      this,
    );
  }

  private onViewComponentDestroy(): void {
    this.removeViewComponentListeners();
    this.removeEvents();
    this.viewComponent = null;
  }
}
