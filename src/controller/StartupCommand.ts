import { SimpleCommand, SyncMacroCommand } from '@rollinsafary/mvc';
import RegisterScenesCommand from './RegisterScenesCommand';

export default class StartupCommand extends SyncMacroCommand<SimpleCommand> {
  public initializeMacroCommand(): void {
    this.addSubCommand(RegisterScenesCommand);
  }
}
