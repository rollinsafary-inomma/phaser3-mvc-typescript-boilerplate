import BaseScene from './BaseScene';

export default class BootScene extends BaseScene {
  public static NAME: string = 'BootScene';
  public static LOAD_COMPLETE_NOTIFICATION: string = `${BootScene.NAME}LoadComplete`;
  public static BOOT_COMPLETE_NOTIFICATION: string = `${BootScene.NAME}BootComplete`;
  public static BOOT_COMPLETE_EVENT: string = `${BootScene.NAME}BootCompleteEvent`;
  public static LOAD_COMPLETE_EVENT: string = `${BootScene.NAME}LoadCompleteEvent`;

  constructor() {
    super(BootScene.NAME);
  }

  public init(): void {
    super.init();
  }

  public preload(): void {}

  public create(): void {
    this.i18n.init('en');
    this.events.emit(BootScene.BOOT_COMPLETE_EVENT);
  }
}
