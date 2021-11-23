import Phaser from 'phaser';
import BaseScene from '../../../scenes/BaseScene';
import { ISizeConfig, ITextureConfig } from '../../phaser/CustomTypes';
import { IBaseButtonText } from './BaseButton';

export class ButtonState extends Phaser.GameObjects.Container {
  constructor(scene: BaseScene, config: any) {
    super(scene);
    const { key, frame, label } = config;
    this.add(scene.add.sprite(0, 0, key, frame));
    if (label) {
      this.add(
        scene.add
          .extText(0, 0, label.text, label)
          .setOrigin(0.5 + (label.offsetX || 0), 0.5 + (label.offsetY || 0)),
      );
    }
  }
}

export interface IButtonState extends ITextureConfig, ISizeConfig {
  textConfig?: IBaseButtonText;
}
