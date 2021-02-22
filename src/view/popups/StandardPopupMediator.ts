import { gameConfig } from '../../constants/GameConfig';
import { BaseMediator } from '../base/BaseMediator';
import PopupManager from '../utils/PopupManager';
import StandardPopup from './StandardPopup';
import GameFacade from '../../GameFacade';
import { Game } from 'phaser';

export default abstract class StandardPopupMediator<
  T extends StandardPopup
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
    console.warn(`${notificationName} is unhandled!`);
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

  public hideView(actionId?:number, ...args: any[]): void {
    !!this.viewComponent && this.popupManager.hide(actionId);
  }

  protected onAction(actionId?: number, ...args: any[]): void {
    this.hideView(actionId);
  }

  protected onViewShow(): void {
    this.sendNotification(
      StandardPopup.SHOW_START_NOTIFICATION,
      this.viewComponent.constructor.name,
    );
  }
  protected onViewShowComplete(): void {
    this.sendNotification(
      StandardPopup.SHOW_COMPLETE_NOTIFICATION,
      this.viewComponent.constructor.name,
    );
  }
  protected onViewHide(): void {
    this.sendNotification(
      StandardPopup.HIDE_START_NOTIFICATION,
      this.viewComponent.constructor.name,
    );
  }
  protected onViewHideComplete(...args: any[]): void {
    this.sendNotification(
      StandardPopup.HIDE_COMPLETE_NOTIFICATION,
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
    this.viewComponent.on(
      StandardPopup.SHOW_START_EVENT,
      this.onViewShow,
      this,
    );
    this.viewComponent.on(
      StandardPopup.SHOW_COMPLETE_EVENT,
      this.onViewShowComplete,
      this,
    );
    this.viewComponent.on(
      StandardPopup.HIDE_START_EVENT,
      this.onViewHide,
      this,
    );
    this.viewComponent.on(
      StandardPopup.HIDE_COMPLETE_EVENT,
      this.onViewHideComplete,
      this,
    );
    this.viewComponent.on(StandardPopup.ACTION_EVENT, this.onAction, this);
    this.viewComponent.on(
      Phaser.GameObjects.Events.DESTROY,
      this.onViewComponentDestroy,
      this,
    );
  }

  protected removeEvents(): void {
    this.viewComponent.off(
      StandardPopup.SHOW_START_EVENT,
      this.onViewShow,
      this,
    );
    this.viewComponent.off(
      StandardPopup.SHOW_COMPLETE_EVENT,
      this.onViewShowComplete,
      this,
    );
    this.viewComponent.off(
      StandardPopup.HIDE_START_EVENT,
      this.onViewHide,
      this,
    );
    this.viewComponent.off(
      StandardPopup.HIDE_COMPLETE_EVENT,
      this.onViewHideComplete,
      this,
    );
    this.viewComponent.off(StandardPopup.ACTION_EVENT, this.onAction, this);
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
