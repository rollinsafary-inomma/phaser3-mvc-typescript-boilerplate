import { SimpleCommand } from '@rollinsafary/mvc';
import { logsEnabled } from '../../constants/Constants';
import { redLog, skyBlueLog } from '../../utils/Logger';

export default abstract class BaseSimpleCommand extends SimpleCommand {
  protected startExecution(notificationName: string, ...args: any[]): void {
    logsEnabled &&
      this.failedGuardsCount === 0 &&
      skyBlueLog(
        `EXECUTED: ${this.constructor.name} `,
        notificationName,
        ...args,
      );
    super.startExecution(notificationName, ...args);
  }

  protected onAnyGuardDenied(notificationName?: string, ...args: any[]): void {
    logsEnabled &&
      redLog(
        `PREVENTED: ${this.constructor.name}`,
        notificationName,
        ...args,
        '----------------------------',
        this.guards,
        { failedGuards: this.failedGuards },
      );
  }
}
