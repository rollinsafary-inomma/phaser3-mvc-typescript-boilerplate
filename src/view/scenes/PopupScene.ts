import BaseScene from './BaseScene';

export default class PopupScene extends BaseScene {
  public static NAME: string = 'PopupScene';
  public static REGISTERED_NOTIFICATION: string = `${PopupScene.NAME}RegisteredNotification`;
  public static WAKE_NOTIFICATION: string = `${PopupScene.NAME}WakeNotification`;
  public static SLEEP_NOTIFICATION: string = `${PopupScene.NAME}SleepNotification`;

  public static SETTING_CHANGE_EVENT: string = `settingChange`;

  constructor() {
    super(PopupScene.NAME);
  }

  public create(): void {
    this.input.setTopOnly(true);
  }
}
