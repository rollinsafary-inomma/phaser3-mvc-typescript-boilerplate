import BaseScene from '../../scenes/BaseScene';
import { IButtonState, ISpriteButtonConfig } from './SimpleButtonInterfaces';

export class SpriteButton extends Phaser.GameObjects.Sprite {
  public static CLICK_EVENT: string = 'click';
  public static OUT_EVENT: string = 'out';
  public static OVER_EVENT: string = 'over';
  private normalState: IButtonState;
  private hoverState?: IButtonState;
  private downState?: IButtonState;
  private disabledState?: IButtonState;

  constructor(
    protected scene: BaseScene,
    configs: ISpriteButtonConfig,
    enabled?: boolean,
  ) {
    super(
      scene,
      0,
      0,
      configs.normalStateConfig.key,
      configs.normalStateConfig.frame,
    );
    this.normalState = configs.normalStateConfig;
    this.hoverState = configs.hoverStateConfig;
    this.downState = configs.downStateConfig;
    this.disabledState = configs.disabledStateConfig;
    this.setListeners();
    if (enabled) {
      this.setEnabled(enabled);
    }
  }

  public setEnabled(isEnabled: boolean): void {
    isEnabled ? this.makeEnabled() : this.makeDisabled();
  }

  protected makeEnabled(): void {
    this.setNormalTexture();
    this.removeAllListeners();
    this.setListeners();
    this.input.enabled = true;
  }

  protected makeDisabled(): void {
    this.input.enabled = false;
    if (this.disabledState) {
      this.setDisabledTexture();
    }
  }

  protected playSfxOnDown(): void {
    //
  }
  protected playSfxOnUp(): void {
    // this.scene.playSFX(Audios.ButtonTapSfx.Name);
  }

  protected setListeners(): void {
    this.setInteractive();
    this.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    this.on(Phaser.Input.Events.POINTER_OVER, this.onPointerOver, this);
    this.on(Phaser.Input.Events.POINTER_OUT, this.onPointerOut, this);
  }

  protected onPointerDown(): void {
    this.downState && this.setDownTexture();
    this.once(Phaser.Input.Events.POINTER_UP, this.onClick, this);
  }

  protected onPointerOver(): void {
    this.hoverState && this.setHoverTexture();
  }

  protected onPointerOut(): void {
    this.off(Phaser.Input.Events.POINTER_UP, this.onClick, this);
    this.setNormalTexture();
  }

  private setNormalTexture(): void {
    this.setTexture(this.normalState.key, this.normalState.frame);
  }
  private setHoverTexture(): void {
    this.setTexture(this.hoverState.key, this.hoverState.frame);
  }
  private setDownTexture(): void {
    this.setTexture(this.downState.key, this.downState.frame);
  }
  private setDisabledTexture(): void {
    this.setTexture(this.disabledState.key, this.disabledState.frame);
  }

  protected onClick(): void {
    this.hoverState ? this.setHoverTexture() : this.setNormalTexture();
    this.emit(SpriteButton.CLICK_EVENT);
  }
}
