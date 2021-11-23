import store from 'store';
export const storageNamespace: string = 'scrabble';
const storage: StoreJsAPI = store.namespace(storageNamespace);

export function setDataToStorage(key: StorageKey, value: any): void {
  storage.set(key, value);
}

export function getDataFromStorage<T>(key: StorageKey, defaultValue?: any): T {
  return storage.get(key, defaultValue);
}

export function removeDataFromStorage(key: StorageKey): void {
  return storage.remove(key);
}

export enum StorageKey {
  USER_DATA = 'userData',
  GAME_SEED = 'gameSeed',
  LAST_GAME_ID = 'lastGameId',
}
