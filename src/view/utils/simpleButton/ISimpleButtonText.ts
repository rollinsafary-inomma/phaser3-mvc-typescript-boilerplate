export default interface ISimpleButtonText {
  text?: string;
  fontSize?: number;
  fill?: string;
  fontFamily?: string;
  origin?: { x: number; y: number };
  align?: string;
  disabledFill?: string;
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
