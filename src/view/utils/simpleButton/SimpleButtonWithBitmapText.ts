import { ExtendedBitmapText } from '@candywings/phaser3-i18n-plugin';
import { gameConfig } from '../../../constants/GameConfig';
import BaseScene from '../../scenes/BaseScene';
import {
  ISimpleButtonBitmapText,
  ISimpleButtonWithBitmapTextConfig,
} from './SimpleButtonInterfaces';

export default class SimpleButtonWithBitmapText extends Phaser.GameObjects
  .Container {
  public static CLICK_EVENT: string = 'click';
  public static OUT_EVENT: string = 'out';
  public static OVER_EVENT: string = 'over';

  protected normalState: Phaser.GameObjects.Sprite;
  protected downState: Phaser.GameObjects.Sprite;
  protected hoverState: Phaser.GameObjects.Sprite;
  protected disabledState: Phaser.GameObjects.Sprite;
  protected text: ExtendedBitmapText;
  protected configs: ISimpleButtonWithBitmapTextConfig;

  constructor(
    protected scene: BaseScene,
    configs: ISimpleButtonWithBitmapTextConfig,
  ) {
    super(scene);
    this.configs = configs;
    this.createBody();
    configs.normalStateConfig.textConfig && this.createText();
    this.onOut();
  }

  public setEnabled(isEnabled: boolean): void {
    isEnabled ? this.makeEnabled() : this.makeDisabled();
  }

  protected setListeners(): void {
    this.setSize(this.normalState.width, this.normalState.height);
    this.setInteractive();
    this.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    this.on(Phaser.Input.Events.POINTER_OVER, this.onHover, this);
  }

  protected playSfxOnDown(): void {
    //
  }
  protected playSfxOnUp(): void {
    // this.scene.playSFX(Audios.ButtonTapSfx.Name);
  }

  protected onPointerDown(): void {
    this.hoverState && this.hoverState.setVisible(false);
    if (this.downState) {
      this.normalState.visible = false;
      this.downState.visible = true;
      !!this.configs.downStateConfig.textConfig &&
        this.updateTextWithConfig(this.configs.downStateConfig.textConfig);
    }
    this.playSfxOnDown();
    this.once(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
  }

  protected onPointerUp(): void {
    this.normalState.visible = true;
    this.downState && this.downState.setVisible(false);
    this.playSfxOnUp();
    this.onClick();
  }

  protected onOut(): void {
    this.emit(SimpleButtonWithBitmapText.OUT_EVENT);
    this.hoverState && this.hoverState.setVisible(false);
    this.downState && this.downState.setVisible(false);
    this.normalState.setVisible(true);
    this.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    !!this.configs.normalStateConfig.textConfig &&
      this.updateTextWithConfig(this.configs.normalStateConfig.textConfig);
  }

  protected onHover(): void {
    this.emit(SimpleButtonWithBitmapText.OVER_EVENT);
    if (this.hoverState) {
      this.hoverState.visible = true;
      this.normalState.visible = false;
      !!this.configs.hoverStateConfig.textConfig &&
        this.updateTextWithConfig(this.configs.hoverStateConfig.textConfig);
    }
    this.once(Phaser.Input.Events.POINTER_OUT, this.onOut, this);
  }

  protected onClick(): void {
    this.emit(SimpleButtonWithBitmapText.CLICK_EVENT);
  }

  protected createBody(): void {
    this.createStates();
    this.setListeners();
  }

  protected createStates(): void {
    // Down state if available
    if (this.configs.downStateConfig) {
      this.downState = this.scene.make.sprite(this.configs.downStateConfig);
      this.add(this.downState);
      this.downState.depth = 5;
    }
    // Hover state if available
    if (this.configs.hoverStateConfig) {
      this.hoverState = this.scene.make.sprite(this.configs.hoverStateConfig);
      this.add(this.hoverState);
      this.hoverState.depth = 10;
      this.hoverState.visible = false;
    }
    // Disabled state if available
    if (this.configs.disabledStateConfig) {
      this.disabledState = this.scene.make.sprite(
        this.configs.disabledStateConfig,
      );
      this.add(this.disabledState);
      this.disabledState.depth = 0;
    }
    // Normal state if available
    this.normalState = this.scene.make.sprite(this.configs.normalStateConfig);
    this.add(this.normalState);
    this.normalState.depth = 15;
  }

  protected createText(): void {
    this.text = this.scene.make.extBitmapText({
      x: 0,
      y: 0,
      text: this.configs.normalStateConfig.textConfig.text,
      font: this.configs.normalStateConfig.textConfig.font,
      size:
        this.configs.normalStateConfig.textConfig.size *
        gameConfig.resolutionMultiplier,
    });
    !!this.configs.normalStateConfig.textConfig.fill &&
      this.text.setTint(this.configs.normalStateConfig.textConfig.fill);
    this.text.align =
      this.configs.normalStateConfig.textConfig.align ||
      Phaser.GameObjects.BitmapText.ALIGN_CENTER;
    this.add(this.text);
    this.text.depth = 20;
    this.text.setOrigin(
      this.configs.normalStateConfig.textConfig.origin
        ? this.configs.normalStateConfig.textConfig.origin.x
        : 0.5,
      this.configs.normalStateConfig.textConfig.origin
        ? this.configs.normalStateConfig.textConfig.origin.y
        : 0.5,
    );
  }

  protected makeEnabled(): void {
    this.input.enabled = true;
    this.normalState.setVisible(true);
    this.disabledState && this.disabledState.setVisible(false);
    this.hoverState && this.hoverState.setVisible(false);
    this.downState && this.downState.setVisible(false);
    !!this.configs.normalStateConfig.textConfig &&
      this.updateTextWithConfig(this.configs.normalStateConfig.textConfig);
  }

  protected makeDisabled(): void {
    this.input.enabled = false;
    if (this.disabledState) {
      this.disabledState.setVisible(true);
      this.normalState.setVisible(false);
      this.hoverState && this.hoverState.setVisible(false);
      this.downState && this.downState.setVisible(false);
      !!this.configs.disabledStateConfig.textConfig &&
        this.updateTextWithConfig(this.configs.disabledStateConfig.textConfig);
    }
  }

  protected updateTextWithConfig(config: ISimpleButtonBitmapText): void {
    this.text.setText(config.text);
    this.text.setFontSize(config.size);
    this.text.setFont(config.font);
    this.text.setOrigin(
      config.origin ? config.origin.x : 0.5,
      config.origin ? config.origin.y : 0.5,
    );
    config.fill && this.text.setTint(config.fill);
  }
}
