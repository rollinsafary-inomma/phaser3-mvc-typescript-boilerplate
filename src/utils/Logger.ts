function write(
  backgroundColor: string,
  fontColor: string,
  text: any,
  ...args: any[]
): boolean {
  const consoleArgs: string[] = [
    ``,
    `background: ${'#c8c8ff'};`,
    `background: ${'#9696ff'};`,
    `color: ${fontColor}; background: ${backgroundColor};`,
    `background: ${'#9696ff'};`,
    `background: ${'#c8c8ff'};`,
  ];

  const isString: boolean = typeof text === 'string';
  !isString && args.unshift(text);

  consoleArgs[0] = `%c %c %c ${isString ? text : 'log'} %c %c`;
  if (args.length) {
    console.groupCollapsed(...consoleArgs);
    for (const arg of args) {
      console.log(arg);
    }
    console.groupEnd();
  } else {
    console.log(...consoleArgs);
  }
  return true;
}
function writeTrace(
  backgroundColor: string,
  fontColor: string,
  text: any,
  ...args: any[]
): boolean {
  const consoleArgs: string[] = [
    ``,
    `background: ${'#c8c8ff'};`,
    `background: ${'#9696ff'};`,
    `color: ${fontColor}; background: ${backgroundColor};`,
    `background: ${'#9696ff'};`,
    `background: ${'#c8c8ff'};`,
  ];

  consoleArgs[0] = `%c %c %c ${text} %c %c`;
  if (args.length) {
    console.groupCollapsed(...consoleArgs);
    console.trace('log trace');
    for (const arg of args) {
      console.log(arg);
    }
    console.groupEnd();
  } else {
    console.log(...consoleArgs);
  }
  return true;
}

export function blueLog(...args: any[]): boolean {
  return write('#0000ff', '#ffffff', args.shift(), ...args);
}
export function skyBlueLog(...args: any[]): boolean {
  return write('#00bfff', '#000000', args.shift(), ...args);
}
export function whiteLog(...args: any[]): boolean {
  return write('#ffffff', '#000000', args.shift(), ...args);
}
export function blackLog(...args: any[]): boolean {
  return write('#000000', '#ffffff', args.shift(), ...args);
}
export function brownLog(...args: any[]): boolean {
  return write('#654321', '#ffffff', args.shift(), ...args);
}
export function pinkLog(...args: any[]): boolean {
  return write('#9F1DB4', '#ffffff', args.shift(), ...args);
}
export function greyLog(...args: any[]): boolean {
  return write('#8e8e8e', '#ffffff', args.shift(), ...args);
}
export function greenLog(...args: any[]): boolean {
  return write('#308751', '#ffffff', args.shift(), ...args);
}
export function redLog(...args: any[]): boolean {
  return write('#ff0000', '#ffffff', args.shift(), ...args);
}
export function errorLog(...args: any[]): boolean {
  return writeTrace('#ff0000', '#ffffff', args.shift(), ...args);
}
