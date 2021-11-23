import { I18nCreator, I18nFactory } from '@rollinsafary/phaser3-i18n-plugin';
import {
  INinePatchCreator,
  INinePatchFactory,
} from '@rollinsafary/phaser3-ninepatch-plugin';

export interface IPosition {
  x: number;
  y: number;
}

export interface ITextureConfig {
  key: string;
  frame?: string;
}

export interface ISizeConfig {
  width?: number;
  height?: number;
}

export interface IEventConfig {
  emitter: Phaser.Events.EventEmitter;
  eventName: string;
}

export interface ITextConfig extends IPosition {
  text: string;
  style: Phaser.Types.GameObjects.Text.TextStyle;
  i18nOptions?: any;
}

export type GameObjectWithTexture = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Texture;

export type StringIndexedObject<T> = { [key: string]: T };

export type SceneCreator = Phaser.GameObjects.GameObjectCreator &
  INinePatchCreator &
  I18nCreator;

export type SceneFactory = Phaser.GameObjects.GameObjectFactory &
  INinePatchFactory &
  I18nFactory;
