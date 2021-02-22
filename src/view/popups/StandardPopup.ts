import { NinePatch } from '@koreez/phaser3-ninepatch';
import { Images } from '../../assets';
import { gameConfig } from '../../constants/GameConfig';
import PopupScene from '../scenes/PopupScene';
import { getScene } from '../utils/phaser/PhaserUtils';

export default class StandardPopup extends Phaser.GameObjects.Container {
  public static NAME: string = 'StandardPopup';
  public static ACTION_EVENT: string = `${StandardPopup.NAME}ActionEvent`;
  public static ACTION_CLOSE: number = 0;

  public static SHOW_START_NOTIFICATION: string = `${StandardPopup.NAME}ShowStartNotification`;
  public static SHOW_COMPLETE_NOTIFICATION: string = `${StandardPopup.NAME}ShowCompleteNotification`;
  public static HIDE_START_NOTIFICATION: string = `${StandardPopup.NAME}HideStartNotification`;
  public static HIDE_COMPLETE_NOTIFICATION: string = `${StandardPopup.NAME}HideCompleteNotification`;

  public static SHOW_START_EVENT: string = `${StandardPopup.NAME}ShowStartEvent`;
  public static SHOW_COMPLETE_EVENT: string = `${StandardPopup.NAME}ShowCompleteEvent`;
  public static HIDE_START_EVENT: string = `${StandardPopup.NAME}HideStartEvent`;
  public static HIDE_COMPLETE_EVENT: string = `${StandardPopup.NAME}HideCompleteEvent`;

  public blocker: Phaser.GameObjects.Image;
  public isAlivePromise: Promise<void>;
  protected closeButton: Phaser.GameObjects.GameObject;

  constructor(public scene: PopupScene = getScene(PopupScene.NAME)) {
    super(scene, gameConfig.canvasWidth / 2, gameConfig.canvasHeight / 2);
    this.isAlivePromise = new Promise<void>(resolve => {
      this.on(Phaser.GameObjects.Events.DESTROY, resolve);
    });
    this.createBody();
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
    return new Promise<void>(async resolve => {
      this.emit(StandardPopup.SHOW_START_EVENT);
      this.setAlpha(0);
      this.playShowSfx();
      await this.showBlocker();
      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        duration: 200,
        ease: Phaser.Math.Easing.Expo.In,
        onComplete: () => {
          this.onShowComplete(...args);
          resolve();
        },
      });
    });
  }

  public async hide(actionId?: number): Promise<void> {
    return new Promise((resolve: (value?: void) => void) => {
      this.emit(StandardPopup.HIDE_START_EVENT);
      this.playHideSfx();
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 200,
        ease: Phaser.Math.Easing.Expo.In,
        onComplete: async () => {
          await this.hideBlocker();
          this.visible = false;
          this.emit(StandardPopup.HIDE_COMPLETE_EVENT, actionId);
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
    return new Promise<void>(resolve => {
      if (!this.blocker || !this.blocker.active) {
        return resolve();
      }

      this.blocker.input.enabled = true;
      const blockerAlpha: number = this.blocker.alpha;
      this.blocker.setAlpha(0);
      this.scene.tweens.add({
        targets: this.blocker,
        alpha: blockerAlpha,
        duration: 200,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  protected async hideBlocker(): Promise<void> {
    return new Promise<void>(resolve => {
      if (!this.blocker || !this.blocker.active) {
        return resolve();
      }

      this.scene.tweens.add({
        targets: this.blocker,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          if (this.blocker) {
            this.blocker.input.enabled = false;
            this.blocker.visible = false;
            this.blocker.destroy();
          }
          resolve();
        },
      });
    });
  }

  protected createBody(): void {
    throw new Error(
      `Method 'createBody' is not implemented in ${this.constructor.name}`,
    );
  }

  protected onShowComplete(...args: any[]): void {
    this.scene.children.bringToTop(this);
    this.emit(StandardPopup.SHOW_COMPLETE_EVENT);
  }

  protected createBg(
    key: string,
    frame: string,
    width: number,
    height: number,
  ): NinePatch {
    const config: any = {
      key,
      frame,
      width,
      height,
    };
    const bg: NinePatch = (this.scene.make as any).ninePatch(config, false);
    bg.setInteractive();
    this.add(bg);
    this.setSize(bg.width, bg.height);
    return bg;
  }

  protected createBgImage(
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
    const config: any = {
      x: gameConfig.canvasWidth / 2,
      y: gameConfig.canvasHeight / 2,
      key,
      frame,
    };
    this.blocker = this.scene.make.image(config);
    this.blocker.alpha = alpha;
    this.blocker.visible = false;
    this.blocker.setInteractive();
    this.setBlockerListeners();
    this.blocker.input.enabled = false;
  }

  protected createColoredBlocker(
    alpha: number = 1,
    color: number = 0x000000,
  ): void {
    this.blocker && this.blocker.destroy();
    this.blocker = this.scene.make.image({
      x: 0,
      y: 0,
      key: Images.WhitePixel.Name,
    });
    this.blocker.setScale(gameConfig.canvasWidth, gameConfig.canvasHeight);
    this.blocker.setOrigin(0);
    this.blocker.setTintFill(color);
    this.blocker.setAlpha(alpha);
    this.blocker.setInteractive();
    this.setBlockerListeners();
    this.blocker.input.enabled = false;
  }

  protected setBlockerListeners(): void {
    this.blocker.on(
      Phaser.Input.Events.POINTER_UP,
      this.blockerPointerUp,
      this,
    );
    this.blocker.on(
      Phaser.Input.Events.POINTER_DOWN,
      this.blockerPointerDown,
      this,
    );
    this.blocker.on(
      Phaser.Input.Events.POINTER_OVER,
      this.blockerPointerOver,
      this,
    );
    this.blocker.on(
      Phaser.Input.Events.POINTER_OUT,
      this.blockerPointerOut,
      this,
    );
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
    this.emit(StandardPopup.ACTION_EVENT, StandardPopup.ACTION_CLOSE);
  }

  protected onAction(action: number, ...args: any[]): void {
    this.emit(StandardPopup.ACTION_EVENT, action, ...args);
  }
}
