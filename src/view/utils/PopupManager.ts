import StandardPopup from '../popups/StandardPopup';
import StandardPopupMediator from '../popups/StandardPopupMediator';
import PopupScene from '../scenes/PopupScene';
import { postRunnable, getScene } from './phaser/PhaserUtils';

export default class PopupManager {
  public currentPopup: StandardPopup;
  private static instance: PopupManager;
  public queue: IQueue<StandardPopup>[] = [];

  public static getInstance(): PopupManager {
    return this.instance || (this.instance = new this());
  }

  public addToQueue<T extends StandardPopup>(
    mediator: StandardPopupMediator<T>,
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

  public removeFromQueue<T extends StandardPopup>(
    mediator: StandardPopupMediator<T>,
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

  public show<T extends StandardPopup>(
    mediator: StandardPopupMediator<T>,
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
    postRunnable(this.showNextPopup, this);
  }

  public showNextPopup(): void {
    !!this.currentPopup && this.currentPopup.active && this.currentPopup.destroy()
    this.queue.shift();
    this.currentPopup = null;
    this.hasQueue ? this.internalShow() : getScene(PopupScene.NAME).sys.sleep()
  }

  private internalShow(): void {
    const popupData: IQueue<StandardPopup> = this.queue[0];
    popupData.mediator.prepareToShow(
      popupData.x,
      popupData.y,
      ...popupData.args,
    );
    this.currentPopup = popupData.mediator.getViewComponent();
    this.scene.sys.isSleeping() && this.scene.sys.wake()
    this.currentPopup.show(popupData.x, popupData.y, ...popupData.args);
  }

  get hasQueue(): boolean {
    return !!this.queue.length;
  }

  get scene(): PopupScene {
    return getScene(PopupScene.NAME)
  }
}

interface IQueue<T extends StandardPopup> {
  mediator: StandardPopupMediator<T>;
  x: number;
  y: number;
  args: any[];
}
