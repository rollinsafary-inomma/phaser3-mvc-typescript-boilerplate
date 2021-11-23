import { MultiAtlases } from '../../assets';
import { gameConfig } from '../../constants/GameConfig';
import Game from '../../Game';
import BaseScene from '../scenes/BaseScene';
import PopupScene from '../scenes/PopupScene';

export default class BasePopup extends Phaser.GameObjects.Container {
  public static NAME: string = 'BasePopup';
  public static ACTION_EVENT: string = `${BasePopup.NAME}ActionEvent`;
  public static ACTION_CLOSE: number = 0;

  public static SHOW_START_NOTIFICATION: string = `${BasePopup.NAME}ShowStart`;
  public static SHOW_COMPLETE_NOTIFICATION: string = `${BasePopup.NAME}ShowComplete`;
  public static HIDE_START_NOTIFICATION: string = `${BasePopup.NAME}HideStart`;
  public static HIDE_COMPLETE_NOTIFICATION: string = `${BasePopup.NAME}HideComplete`;

  public static SHOW_START_EVENT: string = `${BasePopup.NAME}ShowStartEvent`;
  public static SHOW_COMPLETE_EVENT: string = `${BasePopup.NAME}ShowCompleteEvent`;
  public static HIDE_START_EVENT: string = `${BasePopup.NAME}HideStartEvent`;
  public static HIDE_COMPLETE_EVENT: string = `${BasePopup.NAME}HideCompleteEvent`;

  public blocker: Phaser.GameObjects.Image;
  public isAlivePromise: Promise<void>;
  public showPromise: Promise<void>;
  protected closeButton: Phaser.GameObjects.GameObject;

  constructor() {
    super(
      Game.getInstance().scene.getScene(PopupScene.NAME) as BaseScene,
      gameConfig.canvasWidth / 2,
      gameConfig.canvasHeight / 2,
    );
    this.isAlivePromise = new Promise<void>((resolve) => {
      this.on(Phaser.GameObjects.Events.DESTROY, resolve);
    });
    this.createComponents();
    this.scene.add.existing(this);
  }

  public prepareToShow(x: number, y: number, ...args: any[]): void {
    this.x = x;
    this.y = y;
  }

  public prepareToHide(actionId?: number): void {
    this.hide(actionId);
  }

  public preDestroy(): void {
    this.blocker.destroy();
    super.preDestroy();
  }

  public async show(...args: any[]): Promise<void> {
    return (this.showPromise = new Promise<void>(async (resolve) => {
      if (!this.scene) {
        resolve();
      }
      this.emit(BasePopup.SHOW_START_EVENT);
      this.setAlpha(0);
      this.playShowSfx();
      this.showBlocker();
      !!this.scene &&
        this.scene.tweens.add({
          targets: this,
          alpha: 1,
          duration: 100,
          ease: Phaser.Math.Easing.Expo.In,
          onComplete: async () => {
            await this.onShowComplete(...args);
            resolve();
          },
        });
    }));
  }

  public async hide(actionId?: number): Promise<void> {
    await this.showPromise;
    return new Promise((resolve: (value?: void) => void) => {
      this.emit(BasePopup.HIDE_START_EVENT);
      this.playHideSfx();
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 100,
        ease: Phaser.Math.Easing.Expo.In,
        onComplete: async () => {
          await this.hideBlocker();
          this.visible = false;
          this.emit(BasePopup.HIDE_COMPLETE_EVENT, actionId);
          resolve();
        },
      });
    });
  }

  protected playShowSfx(): void {
    // this.scene.playSFX(Audios.PopupShowSfx.Name);
  }
  protected playHideSfx(): void {
    // this.scene.playSFX(Audios.PopupHideSfx.Name);
  }

  protected async showBlocker(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.scene || !this.blocker || !this.blocker.active) {
        return resolve();
      }

      this.blocker.input.enabled = true;
      const blockerAlpha: number = this.blocker.alpha;
      this.blocker.setAlpha(0);
      this.scene.tweens.add({
        targets: this.blocker,
        alpha: blockerAlpha,
        duration: 100,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  protected async hideBlocker(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.scene || !this.blocker || !this.blocker.active) {
        return resolve();
      }

      this.scene.tweens.add({
        targets: this.blocker,
        alpha: 0,
        duration: 100,
        onComplete: () => {
          if (!!this.blocker) {
            !!this.blocker.input && (this.blocker.input.enabled = false);
            this.blocker.visible = false;
            this.blocker.destroy();
          }
          resolve();
        },
      });
    });
  }

  protected createComponents(): void {
    throw new Error(
      `Method 'createBody' is not implemented in ${this.constructor.name}`,
    );
  }

  protected onShowComplete(...args: any[]): void {
    this.scene.children.bringToTop(this);
    this.emit(BasePopup.SHOW_COMPLETE_EVENT);
  }

  protected createBackgroundImage(
    key: string,
    frame: string,
  ): Phaser.GameObjects.Image {
    const config: any = {
      key,
      frame,
    };
    const bg: Phaser.GameObjects.Image = this.scene.make.image(config, false);
    bg.setInteractive();
    this.add(bg);

    this.setSize(bg.width, bg.height);
    return bg;
  }

  protected createBlockerImage(
    key: string,
    frame: string,
    alpha: number = 1,
  ): void {
    this.blocker = this.scene.make.image({
      x: gameConfig.canvasWidth / 2,
      y: gameConfig.canvasHeight / 2,
      key,
      frame,
    });
    this.blocker.alpha = alpha;
    this.blocker.setInteractive();
    this.blocker.input.enabled = false;
    this.add(this.blocker);
  }

  protected createColoredBlocker(
    alpha: number = 1,
    color: number = 0x000000,
  ): void {
    this.blocker && this.blocker.destroy();
    this.blocker = this.scene.make.image({
      x: 0,
      y: 0,
      key: MultiAtlases.Main.Atlas.Name,
      frame: MultiAtlases.Main.Atlas.Frames.MainWhitePixel,
    });
    this.blocker.setScale(gameConfig.canvasWidth, gameConfig.canvasHeight);
    this.blocker.setOrigin(0);
    this.blocker.setTintFill(color);
    this.blocker.setAlpha(alpha);
    this.blocker.setInteractive();
    this.blocker.input.enabled = false;
  }

  protected createCancelButton(
    key: string,
    frame: string,
    x: number = this.width * 0.5,
    y: number = -this.height * 0.5,
  ): void {
    const config: any = {
      x,
      y,
      key,
      frame,
    };
    const closeBtn: Phaser.GameObjects.Image = this.scene.make.image(config);
    closeBtn.setInteractive();
    closeBtn.on(Phaser.Input.Events.POINTER_DOWN, this.emitClose, this);
    this.add(closeBtn);
  }

  protected blockerPointerDown(): void {
    //
  }
  protected blockerPointerUp(): void {
    //
  }
  protected blockerPointerOver(): void {
    //
  }
  protected blockerPointerOut(): void {
    //
  }

  protected emitClose(): void {
    this.emit(BasePopup.ACTION_EVENT, BasePopup.ACTION_CLOSE);
  }

  protected onAction(action: number, ...args: any[]): void {
    this.emit(BasePopup.ACTION_EVENT, action, ...args);
  }
}
