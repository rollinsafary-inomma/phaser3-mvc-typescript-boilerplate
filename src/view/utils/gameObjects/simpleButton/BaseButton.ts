import { ExtendedText } from '@rollinsafary/phaser3-i18n-plugin';
import BaseScene from '../../../scenes/BaseScene';
import { StringIndexedObject } from '../../phaser/CustomTypes';
import { IButtonState } from './ButtonState';

// TODO: fix StringIndexedObject used generic type

type BackgroundType = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Visible &
  Phaser.GameObjects.Components.ComputedSize &
  Phaser.GameObjects.Components.Depth;

export abstract class BaseButton<T extends BackgroundType> extends Phaser
  .GameObjects.Container {
  public static CLICK_EVENT: string = 'click';
  public static OUT_EVENT: string = 'out';
  public static OVER_EVENT: string = 'over';

  protected normalState: T;
  protected downState: T;
  protected hoverState: T;
  protected disabledState: T;
  protected text: ExtendedText;

  constructor(public scene: BaseScene, public configs: IBaseButtonConfig) {
    super(scene);
    this.createComponents();
    this.setListeners();
    this.setEnabled(true);
    this.prepare();
  }

  public destroy(fromScene?: boolean): void {
    this.scene.game.canvas.removeEventListener(
      'mouseout',
      this.onOut.bind(this),
    );
    return super.destroy(fromScene);
  }

  public setEnabled(isEnabled: boolean): void {
    isEnabled ? this.makeEnabled() : this.makeDisabled();
  }

  public setText(text: string, i18nOptions: any = null): void {
    this.text.setText(text, i18nOptions);
  }

  protected setListeners(): void {
    this.setSize(this.normalState.width, this.normalState.height);
    this.setInteractive({ pointer: 'pointer' });
    this.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    if (this.hoverState) {
      this.on(Phaser.Input.Events.POINTER_OVER, this.onHover, this);
      this.scene.game.canvas.addEventListener(
        'mouseout',
        this.onOut.bind(this),
      );
    }
  }

  protected playSfxOnDown(): void {
    //
  }
  protected playSfxOnUp(): void {
    // this.scene.playSFX(Audios.ButtonTapSfx.Name);
  }

  protected onPointerDown(): void {
    this.playSfxOnDown();
    if (this.downState) {
      this.normalState.visible = false;
      this.downState.visible = true;
      this.text &&
        this.configs.downStateConfig.textConfig &&
        this.configs.downStateConfig.textConfig.fill &&
        this.text.setFill(this.configs.downStateConfig.textConfig.fill);
    }
    this.hoverState && this.hoverState.setVisible(false);
    this.once(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
  }

  protected onPointerUp(): void {
    this.playSfxOnUp();
    this.normalState.visible = true;
    this.downState && this.downState.setVisible(false);
    this.onClick();
  }

  protected onOut(): void {
    if ((!!this.disabledState && this.disabledState.visible) || !this.active) {
      return;
    }
    this.emit(BaseButton.OUT_EVENT);
    this.hoverState && this.hoverState.setVisible(false);
    this.downState && this.downState.setVisible(false);
    this.normalState.setVisible(true);
    this.text &&
      ((this.configs.normalStateConfig.textConfig &&
        this.configs.normalStateConfig.textConfig.fill) ||
        (this.configs.textConfig && this.configs.textConfig.fill)) &&
      this.text.setFill(
        this.configs.normalStateConfig?.textConfig?.fill ||
          this.configs?.textConfig?.fill,
      );
    this.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
  }

  protected onHover(): void {
    if (!!this.disabledState && this.disabledState.visible) {
      return;
    }
    this.emit(BaseButton.OVER_EVENT);
    if (this.hoverState) {
      this.hoverState.visible = true;
      this.normalState.visible = false;
      this.text &&
        this.configs.hoverStateConfig.textConfig &&
        this.configs.hoverStateConfig.textConfig.fill &&
        this.text.setFill(this.configs.hoverStateConfig.textConfig.fill);
    }
    this.once(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onOut, this);
  }

  protected onClick(): void {
    this.onHover();
    this.emit(BaseButton.CLICK_EVENT);
  }

  protected abstract createComponents(): void;

  protected createStates(creatorMethodName: string): void {
    this.scene;
    // Down state if available
    if (this.configs.downStateConfig) {
      this.downState = (this.scene.make as StringIndexedObject<any>)[
        creatorMethodName
      ](this.configs.downStateConfig);
      this.add(this.downState);
      this.downState.depth = 5;
    }
    // Hover state if available
    if (this.configs.hoverStateConfig) {
      this.hoverState = (this.scene.make as StringIndexedObject<any>)[
        creatorMethodName
      ](this.configs.hoverStateConfig);
      this.add(this.hoverState);
      this.hoverState.depth = 10;
      this.hoverState.visible = false;
    }
    // Disabled state if available
    if (this.configs.disabledStateConfig) {
      this.disabledState = (this.scene.make as StringIndexedObject<any>)[
        creatorMethodName
      ](this.configs.disabledStateConfig);
      this.add(this.disabledState);
      this.disabledState.depth = 0;
    }
    // Normal state if available
    this.normalState = (this.scene.make as StringIndexedObject<any>)[
      creatorMethodName
    ](this.configs.normalStateConfig);
    this.add(this.normalState);
    this.normalState.depth = 15;
  }

  protected createText(): void {
    if (
      !this.configs.textConfig &&
      !this.configs.normalStateConfig.textConfig
    ) {
      return;
    }
    const config =
      this.configs.textConfig || this.configs.normalStateConfig.textConfig;
    this.text = this.scene.make.extText({
      x: config.x || 0,
      y: config.y || 0,
      text: config.text,
      style: {
        fontSize: config.fontSize,
        fill: config.fill,
        fontFamily: config.fontFamily,
      },
    });
    config.origin && this.text.setOrigin(config.origin.x, config.origin.y);
    if (config.stroke) {
      this.text.setStroke(config.stroke.color, config.stroke.thickness);
    }
    if (config.shadow) {
      this.text.setShadow(
        config.shadow.x,
        config.shadow.y,
        config.shadow.color,
        config.shadow.blur,
        config.shadow.shadowStroke,
        config.shadow.shadowFill,
      );
    }
    this.add(this.text);
    this.text.depth = 20;
  }

  protected makeEnabled(): void {
    this.input.cursor = 'pointer';
    this.input.enabled = true;
    if (this.disabledState) {
      this.disabledState.setVisible(false);
      this.normalState.setVisible(true);
      this.hoverState && this.hoverState.setVisible(false);
      this.downState && this.downState.setVisible(false);
    }
    if (this.text) {
      this.text.setFill(
        this.configs.textConfig?.fill ||
          this.configs.normalStateConfig.textConfig?.fill,
      );
    }
  }

  protected makeDisabled(): void {
    this.input.cursor = 'default';
    this.input.enabled = false;
    if (this.disabledState) {
      this.disabledState.setVisible(true);
      this.normalState.setVisible(false);
      this.hoverState && this.hoverState.setVisible(false);
      this.downState && this.downState.setVisible(false);
    }
    if (this.text) {
      this.text.setFill(
        this.configs.disabledStateConfig?.textConfig?.fill ||
          this.configs.textConfig?.fill ||
          this.configs.normalStateConfig.textConfig?.fill,
      );
    }
  }

  protected prepare(): void {
    //
  }
}

export interface IBaseButtonConfig {
  normalStateConfig: IButtonState;
  downStateConfig?: IButtonState;
  hoverStateConfig?: IButtonState;
  disabledStateConfig?: IButtonState;
  textConfig?: IBaseButtonText;
}

export interface IBaseButtonText {
  x?: number;
  y?: number;
  text?: string;
  fontSize?: number;
  fill?: string;
  fontFamily?: string;
  origin?: { x: number; y: number };
  align?: string;
  stroke?: { color: string; thickness: number };
  shadow?: {
    x: number;
    y: number;
    color: string;
    blur: number;
    shadowStroke: boolean;
    shadowFill: boolean;
  };
}
