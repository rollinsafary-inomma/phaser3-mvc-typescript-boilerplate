import BaseScene from '../../scenes/BaseScene';
import ISimpleButtonText from './ISimpleButtonText';
import { IButtonState } from './SimpleButtonInterfaces';

export default class SimpleButton extends Phaser.GameObjects.Container {
  public static CLICK_EVENT: string = 'click';
  public static OUT_EVENT: string = 'out';
  public static OVER_EVENT: string = 'over';

  private normalState: Phaser.GameObjects.Sprite;
  private downState: Phaser.GameObjects.Sprite;
  private hoverState: Phaser.GameObjects.Sprite;
  private disabledState: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;

  constructor(
    protected scene: BaseScene,
    protected configs: {
      normalStateConfig: IButtonState;
      downStateConfig?: IButtonState;
      hoverStateConfig?: IButtonState;
      disabledStateConfig?: IButtonState;
      textConfig?: ISimpleButtonText;
    },
  ) {
    super(scene);
    this.createBody();
    this.createText();
  }

  public setEnabled(isEnabled: boolean): void {
    isEnabled ? this.makeEnabled() : this.makeDisabled();
  }

  protected setListeners(): void {
    this.setSize(this.normalState.width, this.normalState.height);
    this.setInteractive();
    this.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    this.on(Phaser.Input.Events.POINTER_OVER, this.onHover, this);
    this.hoverState &&
      this.on(Phaser.Input.Events.POINTER_OVER, this.onHover, this);
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
    this.emit(SimpleButton.OUT_EVENT);
    this.hoverState && this.hoverState.setVisible(false);
    this.downState && this.downState.setVisible(false);
    this.normalState.setVisible(true);
    this.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
  }

  protected onHover(): void {
    this.emit(SimpleButton.OVER_EVENT);
    if (this.hoverState) {
      this.hoverState.visible = true;
      this.normalState.visible = false;
    }
    this.once(Phaser.Input.Events.POINTER_OUT, this.onOut, this);
  }

  protected onClick(): void {
    this.emit(SimpleButton.CLICK_EVENT);
  }

  private createBody(): void {
    this.createStates();
    this.setListeners();
  }

  private createStates(): void {
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

  private createText(): void {
    if (!this.configs.textConfig) {
      return;
    }
    this.text = this.scene.make.extText({
      x: 0,
      y: 0,
      text: this.configs.textConfig.text,
      style: {
        fontSize: this.configs.textConfig.fontSize,
        fill: this.configs.textConfig.fill,
        fontFamily: this.configs.textConfig.fontFamily,
      },
    });
    const textConfig: ISimpleButtonText = this.configs.textConfig;
    this.configs.textConfig.origin &&
      this.text.setOrigin(
        this.configs.textConfig.origin.x,
        this.configs.textConfig.origin.y,
      );
    if (textConfig.stroke) {
      this.text.setStroke(textConfig.stroke.color, textConfig.stroke.thickness);
    }
    if (textConfig.shadow) {
      this.text.setShadow(
        textConfig.shadow.x,
        textConfig.shadow.y,
        textConfig.shadow.color,
        textConfig.shadow.blur,
        textConfig.shadow.shadowStroke,
        textConfig.shadow.shadowFill,
      );
    }
    this.add(this.text);
    this.text.depth = 20;
  }

  private makeEnabled(): void {
    this.input.enabled = true;
    if (this.disabledState) {
      this.disabledState.setVisible(false);
      this.normalState.setVisible(true);
      this.hoverState && this.hoverState.setVisible(false);
      this.downState && this.downState.setVisible(false);
    }
    if (this.text && this.configs.textConfig.fill) {
      this.text.setFill(this.configs.textConfig.fill);
    }
  }

  private makeDisabled(): void {
    this.input.enabled = false;
    if (this.disabledState) {
      this.disabledState.setVisible(true);
      this.normalState.setVisible(false);
      this.hoverState && this.hoverState.setVisible(false);
      this.downState && this.downState.setVisible(false);
    }
    if (this.text && this.configs.textConfig.disabledFill) {
      this.text.setFill(this.configs.textConfig.disabledFill);
    }
  }
}
