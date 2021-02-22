export interface ISimpleButtonBitmapText {
  text?: string;
  size?: number;
  fill?: number;
  font?: string;
  origin?: { x: number; y: number };
  align?: number;
  alpha?: number;
}

export interface ISpriteButtonState {
  key: string;
  frame: string;
}
export interface IButtonState extends ISpriteButtonState {
  textConfig?: ISimpleButtonBitmapText;
}

export interface ISimpleButtonWithBitmapTextConfig {
  normalStateConfig: IButtonState;
  downStateConfig?: IButtonState;
  hoverStateConfig?: IButtonState;
  disabledStateConfig?: IButtonState;
}

export interface ISpriteButtonConfig {
  normalStateConfig: ISpriteButtonState;
  hoverStateConfig?: ISpriteButtonState;
  downStateConfig?: ISpriteButtonState;
  disabledStateConfig?: ISpriteButtonState;
}
