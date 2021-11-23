import { Facade } from '@rollinsafary/mvc';
import { I18nGame, I18nPlugin } from '@rollinsafary/phaser3-i18n-plugin';
import { Locales } from './assets';
import { gameConfig } from './constants/GameConfig';
import { STARTUP_NOTIFICATION } from './constants/GlobalNotifications';
import { generateGameConfiguration } from './view/utils/phaser/PhaserUtils';

export default class Game extends I18nGame {
  public static NAME: string = 'Game';

  protected static instance: Game;

  public static getInstance(): Game {
    if (!this.instance) {
      new Game();
    }
    return this.instance;
  }
  constructor() {
    super(generateGameConfiguration());
    Game.instance = this;
    this.createI18n();
    window.onresize = this.resize.bind(this);
    this.resize();
    this.canvas.focus();
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this), {
      once: true,
    });
    this.events.on(Phaser.Core.Events.READY, this.initializeArchitecture, this);
  }

  public initializeArchitecture(): void {
    const facade = Facade.getInstance(Game.NAME);
    // facade.initializeFacade();
    facade.sendNotification(STARTUP_NOTIFICATION);
  }

  public createI18n(): void {
    this.i18n = new I18nPlugin(this, {
      languages: [
        { key: Locales.En.Name, keyJSON: Locales.En.Name },
        { key: Locales.Ru.Name, keyJSON: Locales.Ru.Name },
      ],
      language: Locales.En.Name,
      valueInjectorOpener: '{{',
      valueInjectorCloser: '}}',
      // fontMappings: [
      //   { en: Fonts.ArialBlack.Name, ru: Fonts.ArialBlack.Name },
      //   { en: Fonts.AvenirNextBold.Name, ru: Fonts.AvenirNextBold.Name },
      //   { en: Fonts.AvenirNextMedium.Name, ru: Fonts.AvenirNextMedium.Name },
      //   { en: Fonts.RobotoSlab.Name, ru: Fonts.RobotoSlab.Name },
      // ],
      // bitmapFontMappings: [
      //   { en: BitmapFonts.Roboto.Name, ru: BitmapFonts.Roboto.Name },
      //   { en: BitmapFonts.RobotoSlab.Name, ru: BitmapFonts.RobotoSlab.Name },
      // ],
    });
  }

  public resize(): void {
    const { width, height } = this.config as any;

    const scale: { x: number; y: number } = {
      x: (window.innerWidth || width) / width,
      y: (window.innerHeight || height) / height,
    };
    const browserScale: number = Math.min(
      window.innerHeight / height,
      window.innerWidth / width,
    );
    scale.x = scale.y = browserScale;
    this.canvas.style.position = 'absolute';
    this.canvas.style.width = width * scale.x + 'px';
    this.canvas.style.height = height * scale.y + 'px';
    this.canvas.style.left = 0 + 'px';
    this.canvas.style.top = 0 + 'px';
    this.input.scaleManager.setGameSize(
      gameConfig.canvasWidth,
      gameConfig.canvasHeight,
    );
  }

  private onBeforeUnload(): void {
    this.canvas.style.display = 'none';
  }
}
