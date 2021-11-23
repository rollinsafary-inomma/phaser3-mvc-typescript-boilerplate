import { I18nScene } from '@rollinsafary/phaser3-i18n-plugin';
import { gameConfig } from '../../constants/GameConfig';
import Game from '../../Game';
import {
  IPosition,
  SceneCreator,
  SceneFactory,
} from '../utils/phaser/CustomTypes';

export default class BaseScene extends I18nScene {
  public static NAME: string = 'BaseScene';
  public static get STARTED_NOTIFICATION(): string {
    return `${this.name}Started`;
  }
  public static get READY_NOTIFICATION(): string {
    return `${this.name}Ready`;
  }
  public static get STOPPED_NOTIFICATION(): string {
    return `${this.name}Stopped`;
  }
  public static get SLEPT_NOTIFICATION(): string {
    return `${this.name}Slept`;
  }
  public static get WOKE_NOTIFICATION(): string {
    return `${this.name}Woke`;
  }
  public static PLAY_SFX_NOTIFICATION: string = `${BaseScene.NAME}PlaySfx`;
  public static STOP_SFX_NOTIFICATION: string = `${BaseScene.NAME}StopSfx`;
  public static PLAY_SFX_EVENT: string = `playSfx`;
  public static STOP_SFX_EVENT: string = `stopSfx`;
  public add: SceneFactory;
  public make: SceneCreator;
  public game: Game;
  public spine: any;

  constructor(name: string) {
    super(name);
  }

  public async slideTo(from?: IPosition, to?: IPosition): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.tweens.killTweensOf(this.cameras.main);
      if (from) {
        this.cameras.main.x = Math.sign(from.x) * gameConfig.canvasWidth;
        this.cameras.main.y = Math.sign(from.y) * gameConfig.canvasHeight;
      }
      this.tweens.add({
        targets: this.cameras.main,
        x: to ? gameConfig.canvasWidth * Math.sign(to.x) : 0,
        y: to ? gameConfig.canvasHeight * Math.sign(to.y) : 0,
        duration: 700,
        ease: Phaser.Math.Easing.Expo.InOut,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  public playSFX(name: string, loop: boolean = false): void {
    this.events.emit(BaseScene.PLAY_SFX_EVENT, name, loop);
  }

  public stopSFX(): void {
    this.events.emit(BaseScene.STOP_SFX_EVENT);
  }

  public init(...args: any[]): void {
    this.input.setGlobalTopOnly(true);
    this.i18n = this.game.i18n;
  }

  get width(): number {
    return this.cameras.main.width;
  }
  get height(): number {
    return this.cameras.main.height;
  }

  public get isMobile(): boolean {
    return this.input.activePointer.wasTouch;
  }
}
