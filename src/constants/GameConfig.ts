import { StringIndexedObject } from '../view/utils/phaser/CustomTypes';

export enum Orientation {
  PORTRAIT,
  LANDSCAPE,
}

export let gameConfig: IGameScreenConfig = {
  designWidth: 1920,
  designHeight: 1080,
  canvasWidth: 1920,
  canvasHeight: 1080,
  designRatio: 1,
  deviceRatio: 1,
  orientation: Orientation.LANDSCAPE,
  resolutionMultiplier: 1,
};

export interface IGameScreenConfig extends StringIndexedObject<number> {
  designWidth: number;
  designHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  designRatio: number;
  deviceRatio: number;
  orientation: Orientation;
  resolutionMultiplier: number;
}
