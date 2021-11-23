import { SimpleCommand } from '@rollinsafary/mvc';
import { READY_TO_START_NOTIFICATION } from '../constants/GlobalNotifications';
import BootSceneMediator from '../view/scenes/BootSceneMediator';
import PopupSceneMediator from '../view/scenes/PopupSceneMediator';
import ServiceSceneMediator from '../view/scenes/ServiceSceneMediator';

export default class RegisterScenesCommand extends SimpleCommand {
  public execute(): void {
    this.facade.registerMediator(new ServiceSceneMediator());
    this.facade.registerMediator(new PopupSceneMediator());
    this.facade.registerMediator(new BootSceneMediator());
    this.sendNotification(READY_TO_START_NOTIFICATION);
  }
}
