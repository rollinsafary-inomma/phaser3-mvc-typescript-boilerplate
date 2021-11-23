export function delayRunnable(
  scene: Phaser.Scene,
  delay: number,
  runnable: Function,
  context?: any,
  ...args: any[]
): Phaser.Time.TimerEvent {
  const timerEvent: Phaser.Time.TimerEvent = _addRunnable(
    scene,
    delay,
    runnable,
    context,
    false,
    ...args,
  );
  return timerEvent;
}

export function loopRunnable(
  scene: Phaser.Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  ...args: any[]
): Phaser.Time.TimerEvent {
  return _addRunnable(scene, delay, runnable, context, true, ...args);
}

export function postRunnable(
  scene: Phaser.Scene,
  runnable: Function,
  context?: any,
  ...args: any[]
): Phaser.Time.TimerEvent {
  return delayRunnable(
    scene,
    scene.game.loop.delta,
    runnable,
    context,
    ...args,
  );
}

function _addRunnable(
  scene: Phaser.Scene,
  delay: number,
  runnable: Function,
  context: any,
  loop: boolean = false,
  ...args: any[]
): Phaser.Time.TimerEvent {
  return scene.time.addEvent({
    delay,
    callback: runnable,
    callbackScope: context,
    loop,
    args,
  });
}

export function removeRunnable(runnable: Phaser.Time.TimerEvent): void {
  !!runnable && runnable.destroy();
}

export function isoToMs(iso: string): number {
  const date: Date = new Date(iso);
  return Date.parse(date.toString());
}
