import { NinePatchPlugin } from '@rollinsafary/phaser3-ninepatch-plugin';
import { logsEnabled } from '../../../constants/Constants';
import { gameConfig } from '../../../constants/GameConfig';

// game configs start

export function generateGameConfiguration(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.WEBGL,
    width: gameConfig.canvasWidth,
    height: gameConfig.canvasHeight,
    parent: 'game-container',
    transparent: false,
    roundPixels: true,
    backgroundColor: '#000000',
    banner: {
      text: '#ffffff',
      background: ['#fff200', '#38f0e8', '#00bff3', '#ec008c'],
      hidePhaser: !logsEnabled,
    },
    fps: {
      min: 60,
      target: 120,
    },
    plugins: {
      global: [
        { key: NinePatchPlugin.NAME, plugin: NinePatchPlugin, start: true },
      ],
    },
  };
}

export function getPathPrefix(): string {
  const index = window.location.href.indexOf('/', 8);
  const root = window.location.href.substring(0, index + 1);
  let addon: string = window.location.href.substring(root.length);
  const pathsCount: number = (addon.match('/') || []).length;
  let pathPrefix: string = '';
  for (let i: number = 0; i < pathsCount; i++) {
    pathPrefix += '../';
  }
  return pathPrefix;
}

export type VisibleGameObject = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Visible &
  Phaser.GameObjects.Components.Transform &
  (
    | Phaser.GameObjects.Components.Size
    | Phaser.GameObjects.Components.ComputedSize
  );

export function fixPhaserBugs(): void {
  fixCanvasSnapshot();
}

function fixCanvasSnapshot(): void {
  Phaser.Renderer.Canvas.CanvasRenderer.prototype.snapshotCanvas = function (
    canvas,
    callback,
    getPixel,
    x,
    y,
    width,
    height,
    type,
    encoderOptions,
  ) {
    if (getPixel === undefined) {
      getPixel = false;
    }

    this.snapshotArea(x, y, width, height, callback, type, encoderOptions);

    var state = this.snapshotState;

    state.getPixel = getPixel;
    Phaser.Renderer.Snapshot.Canvas(canvas, state);

    state.callback = null;

    return this;
  };
}
