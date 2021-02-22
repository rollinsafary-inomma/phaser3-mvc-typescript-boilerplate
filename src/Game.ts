import { I18nGame, I18nPlugin } from '@candywings/phaser3-i18n-plugin';
import { Facade } from '@candywings/pure-mvc';
import { Locales } from './assets';
import { gameConfig } from './constants/GameConfig';
import GameFacade from './GameFacade';
import { generateGameConfiguration } from './view/utils/phaser/PhaserUtils';

export default class Game extends I18nGame {
  public static NAME: string = 'Game';
  constructor() {
    super(generateGameConfiguration());
    this.createI18n();
    this.initializeArchitecture();
    window.onresize = this.resize.bind(this);
    this.resize();
    this.canvas.focus();
    window.addEventListener('beforeunload', () => {
      for (const scene of this.scene.getScenes(true)) {
        scene.sys.pause();
      }
    });
  }

  public initializeArchitecture(): void {
    GameFacade.game = this;
    Facade.getInstance = GameFacade.getInstance;
    Facade.getInstance(Game.NAME);
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
}
