import { BaseButton } from './BaseButton';

export class SimpleButton extends BaseButton<Phaser.GameObjects.Sprite> {
  protected createComponents(): void {
    this.createStates('image');
    this.createText();
  }
}
