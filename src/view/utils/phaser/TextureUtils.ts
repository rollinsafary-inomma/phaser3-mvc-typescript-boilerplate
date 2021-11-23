import { errorLog } from '../../../utils/Logger';

export async function loadImageFromUrl(
  scene: Phaser.Scene,
  key: string,
  url: string,
  corsEnabled: boolean = true,
  defaultBase64?: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!url) {
      return resolve();
    }
    const headers: Headers = new Headers({});
    const request: Request = new Request(url);
    const options: any = {
      method: 'GET',
      headers,
      mode: corsEnabled ? 'cors' : 'no-cors',
      cache: 'default',
    };
    fetch(request, options)
      .then((response: any) => {
        response
          .arrayBuffer()
          .then((buffer: any) => {
            const imageStr: string = Phaser.Utils.Base64.ArrayBufferToBase64(
              buffer,
              'image/png',
            );
            return imageStr;
          })
          .then((base64: string) => {
            removeKey(scene, key, () => {
              addBase64(scene, key, base64, resolve);
            });
          });
      })
      .catch((reason: Error) => {
        errorLog('loadImageFromUrl', reason);
        if (!!defaultBase64) {
          addBase64(scene, key, defaultBase64, resolve);
        } else {
          resolve();
        }
      });
  });
}

function addBase64(
  scene: Phaser.Scene,
  key: string,
  base64: string,
  callback: Function,
): void {
  if (scene.textures.exists(key)) {
    return callback();
  }
  const addCallback = (addedTextureKey: string) => {
    if (addedTextureKey === key) {
      scene.textures.off(Phaser.Textures.Events.ADD, addCallback);
      callback();
    }
  };
  scene.textures.on(Phaser.Textures.Events.ADD, addCallback);
  scene.textures.addBase64(key, base64);
}

function removeKey(scene: Phaser.Scene, key: string, callback: Function): void {
  if (!scene.textures.exists(key)) {
    return callback();
  }
  scene.textures.remove(key);
  scene.textures.removeKey(key);
  callback();
}

export function arrayBufferToBase64(buffer: any): any {
  let binary: string = '';
  const bytes: any = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b: any) => (binary += String.fromCharCode(b)));

  return window.btoa(binary);
}

export function hasFrame(
  scene: Phaser.Scene,
  key: string,
  frameName: string,
): boolean {
  const texture: Phaser.Textures.Texture = scene.textures.get(key);
  const frameNames: string[] = texture.getFrameNames();
  return frameNames.includes(frameName);
}
