import {
  NinePatch,
  NinePatchPlugin,
} from '@rollinsafary/phaser3-ninepatch-plugin';
import { BaseButton } from './BaseButton';

export default class NinePatchButton extends BaseButton<NinePatch> {
  protected createComponents(): void {
    this.createStates(NinePatchPlugin.GAME_OBJECT_NAME);
    this.createText();
  }
}
