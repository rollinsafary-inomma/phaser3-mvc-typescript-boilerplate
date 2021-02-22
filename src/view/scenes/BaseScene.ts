import {
  I18nCreator,
  I18nFactory,
  I18nScene,
} from '@candywings/phaser3-i18n-plugin';
import {
  INinePatchCreator,
  INinePatchFactory,
} from '@koreez/phaser3-ninepatch';
import { gameConfig } from '../../constants/GameConfig';
import Game from '../../Game';
import { IPosition } from '../utils/phaser/PhaserUtils';

export default class BaseScene extends I18nScene {
  public static PLAY_SFX_NOTIFICATION: string = `BaseScenePlaySfxNotification`;
  public static STOP_SFX_NOTIFICATION: string = `BaseSceneStopSfxNotification`;
  public static PLAY_SFX_EVENT: string = `playSfx`;
  public static STOP_SFX_EVENT: string = `stopSfx`;
  public add: INinePatchFactory & I18nFactory;
  public make: INinePatchCreator & I18nCreator;
  public game: Game;
  public spine: any;

  constructor(name: string) {
    super(name);
    (this.constructor as any)['START'] = `${name}StartNotification`;
    (this.constructor as any)['READY'] = `${name}ReadyNotification`;
    (this.constructor as any)['PRE_UPDATE'] = `${name}PreUpdateNotification`;
    (this.constructor as any)['UPDATE'] = `${name}UpdateNotification`;
    (this.constructor as any)['POST_UPDATE'] = `${name}PostUpdateNotification`;
    (this.constructor as any)['RESIZE'] = `${name}ResizeNotification`;
    (this.constructor as any)['PAUSE'] = `${name}PauseNotification`;
    (this.constructor as any)['RESUME'] = `${name}ResumeNotification`;
    (this.constructor as any)['SLEEP'] = `${name}SleepNotification`;
    (this.constructor as any)['WAKE'] = `${name}WakeNotification`;
    (this.constructor as any)[
      'TRANSITION_INIT'
    ] = `${name}TransitionInitNotification`;
    (this.constructor as any)[
      'TRANSITION_COMPLETE'
    ] = `${name}TransitionCompleteNotification`;
    (this.constructor as any)[
      'TRANSITION_OUT'
    ] = `${name}TransitionOutNotification`;
    (this.constructor as any)['SHUTDOWN'] = `${name}ShutdownNotification`;
    (this.constructor as any)['DESTROY'] = `${name}DestroyNotification`;
    (this.constructor as any)[
      'LANGUAGE_CHANGED_EVENT'
    ] = `languageChangedEvent`;
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
    //this.events.emit(BaseScene.PLAY_SFX_EVENT, name, loop);
  }

  public stopSFX(): void {
    //this.events.emit(BaseScene.STOP_SFX_EVENT);
  }

  public init(...args: any[]): void {
    this.input.setTopOnly(false);
    this.i18n = this.game.i18n;
    this.input.addPointer(4);
  }

  get width(): number {
    return this.cameras.main.width;
  }
  get height(): number {
    return this.cameras.main.height;
  }

  // public showBackground(): void {
  //   //
  // }
}
