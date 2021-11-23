import BasePopup from '../popups/BasePopup';
import BasePopupMediator from '../popups/BasePopupMediator';
import BaseScene from '../scenes/BaseScene';
import { postRunnable } from './phaser/TimeUtils';

export default class PopupManager {
  public currentPopup: BasePopup;
  private static instance: PopupManager;
  public static scene: BaseScene;
  public queue: IQueue<BasePopup>[] = [];

  public static getInstance(): PopupManager {
    return this.instance || (this.instance = new this());
  }

  public addToQueue<T extends BasePopup>(
    mediator: BasePopupMediator<T>,
    x: number,
    y: number,
    ...args: any[]
  ): void {
    this.queue.push({
      mediator,
      x,
      y,
      args,
    });
  }

  public removeFromQueue<T extends BasePopup>(
    mediator: BasePopupMediator<T>,
    ...args: any[]
  ): void {
    const target: any = this.queue.filter((queueData: IQueue<T>) => {
      return (
        queueData.mediator === mediator &&
        (args ? queueData.args === args : true)
      );
    })[0];
    this.queue.remove(target);
  }

  public show<T extends BasePopup>(
    mediator: BasePopupMediator<T>,
    x: number,
    y: number,
    ...args: any[]
  ): void {
    this.queue.push({
      mediator,
      x,
      y,
      args,
    });
    this.queue.length === 1 && this.internalShow();
  }

  public async hide(actionId?: number): Promise<void> {
    await this.currentPopup.hide(actionId);
    postRunnable(PopupManager.scene, this.showNextPopup, this);
  }

  public showNextPopup(): void {
    !!this.currentPopup &&
      this.currentPopup.active &&
      this.currentPopup.destroy();
    this.queue.shift();
    this.currentPopup = null;
    this.hasQueue ? this.internalShow() : PopupManager.scene.sys.sleep();
  }

  private internalShow(): void {
    const popupData: IQueue<BasePopup> = this.queue[0];
    popupData.mediator.prepareToShow(
      popupData.x,
      popupData.y,
      ...popupData.args,
    );
    this.currentPopup = popupData.mediator.getViewComponent();
    PopupManager.scene.sys.isSleeping() && PopupManager.scene.sys.wake();
    this.currentPopup.show(popupData.x, popupData.y, ...popupData.args);
  }

  get hasQueue(): boolean {
    return !!this.queue.length;
  }
}

interface IQueue<T extends BasePopup> {
  mediator: BasePopupMediator<T>;
  x: number;
  y: number;
  args: any[];
}
