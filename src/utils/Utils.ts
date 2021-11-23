export type StringKeys<T> = { [key: string]: T };

declare global {
  interface Array<T> {
    remove(...element: T[]): T[];
    getFirst(): T;
    getLast(): T;
    addAt(index: number, ...elements: T[]): T[];
    removeAt(index: number, ...elements: T[]): T;
  }
}

Array.prototype.remove = function <T>(...elements: T[]) {
  for (const element of elements) {
    this.includes(element) && this.splice(this.indexOf(element), 1);
  }
  return elements;
};
Array.prototype.getLast = function () {
  return this[this.length - 1];
};
Array.prototype.getFirst = function () {
  return this[0];
};
Array.prototype.addAt = function <T>(index: number, ...elements: T[]) {
  this.splice(index, 0, ...elements);
  return this;
};

Array.prototype.removeAt = function (index: number) {
  this.splice(index, 1);
  return this;
};

export function serialize<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

export function formatTime(ms: number): string {
  const allInSecs: number = Math.floor(ms / 1000);
  let minutes: number = Math.floor(allInSecs / 60);
  let seconds: number = allInSecs % 60;
  minutes = minutes < 0 ? 0 : minutes;
  seconds = seconds < 0 ? 0 : seconds;
  return `${minutes < 10 ? '0' + minutes : minutes}։${
    seconds < 10 ? '0' + seconds : seconds
  }`;
}

export function formatValue(
  value: number,
  fixTo: number = 2,
  roundSmallValues: boolean = false,
): string {
  value = +value.toFixed(2);
  let exponent: number = 0;
  while (1000 ** exponent <= value) {
    exponent++;
  }
  exponent -= 1;
  if (exponent < 0) {
    return value.toString();
  }
  let numberPart: number = +(value / 1000 ** exponent);
  numberPart =
    fixTo === 0
      ? Math.floor(+numberPart.toFixed(3))
      : +numberPart.toFixed(fixTo);
  const postfix: string = generateStringPart(exponent);
  const resultNumber: number =
    fixTo >= 1 || postfix.length > 0
      ? +numberPart.toFixed(numberPart < 100 ? 1 : 0)
      : +numberPart.toFixed(roundSmallValues ? 0 : fixTo);
  return resultNumber + postfix;
}

const ALPHABET: string = 'abcdefghijklmnopqrstuvwxyz';

function generateStringPart(exponent: number): string {
  let result: string = '';
  switch (exponent) {
    case 0:
      break;
    case 1:
      result = 'K';
      break;
    case 2:
      result = 'M';
      break;
    case 3:
      result = 'B';
      break;
    case 4:
      result = 'T';
      break;
    default:
      const firstElementIndex: number = Math.floor(
        (exponent - 5) / ALPHABET.length,
      );
      const secondElementIndex: number = (exponent - 5) % ALPHABET.length;
      result += ALPHABET[firstElementIndex];
      result += ALPHABET[secondElementIndex];
      break;
  }
  return result;
}

declare const VERSION: string;

declare const env: IEnvironmentVariable;
declare const mode: string;
declare const __APP_VERSION__: string;
declare const envName: string;

export function getEnvName(): string {
  return envName;
}

export function getEnv(): IEnvironmentVariable {
  return env;
}
export function getMode(): string {
  return mode;
}

export function getAppVersion(): string {
  return __APP_VERSION__;
}

export function getGameVersion(): string {
  return VERSION;
}

export function upperCaseFirstLetter(value: string): string {
  return value.substr(0, 1).toUpperCase() + value.substr(1, value.length);
}

export function toKebabCase(value: string): string {
  value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  value.indexOf('-') === 0 && value.substring(1);
  return value;
}

export function sumArrayValues(...arr: number[]): number {
  let total: number = 0;
  for (const num of arr) {
    total += num;
  }
  return total;
}

export function populateAndConcat(
  array: string[],
  concatWith: string = '',
): string {
  let result: string = '';
  for (const item of array) {
    result += item + concatWith;
  }
  return result;
}

export function getFramesCountByString(node: any, str: string): number {
  const keys: string[] = Object.keys(node);
  return keys.filter((value: string) => value.indexOf(str) !== -1).length;
}

export interface IEnv {
  API_ROUTE: string;
}

export function shuffleArray<T>(array: Array<T>): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export async function loadScript(url: string, params?: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const script: HTMLScriptElement & StringKeys<any> =
      document.createElement('script');
    script.src = url;
    if (!!params) {
      const keys: string[] = Object.keys(params);
      for (const key of keys) {
        script[key] = params[key];
      }
    }
    document.head.append(script);
    script.onload = () => resolve();
    script.onerror = (error: any) => reject(error);
  });
}

export function fromObjectToArgs(object: any, keys?: string[]): any[] {
  const currentKeys: string[] = Object.keys(object);
  for (let i: number = 0; i < keys.length; i++) {
    const key: string = keys[i];
    if (currentKeys.includes(key)) {
      currentKeys.remove(key);
      currentKeys.addAt(i, key);
    }
  }
  return keys.map((key: string) => object[key]);
}

export function pickAny<T>(array: Array<T>): T {
  return array[Phaser.Math.Between(0, array.length - 1)];
}

export function copyToClipboard(line: string): void {
  const textArea: HTMLTextAreaElement = document.createElement('textarea');
  textArea.value = line;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

export interface IEnvironmentVariable {
  API_HOST: string;
  PUSHER_APP_KEY: string;
  PUSHER_CLUSTER: string;
  ZOEY_ID: number;
  TITAN_API_KEY: string;
}
