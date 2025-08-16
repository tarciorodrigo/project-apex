import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from './interfaces/strategy.interface';

@Injectable()
export class StrategyFactory {
  private readonly logger = new Logger(StrategyFactory.name);

  createStrategy(type: string): Strategy {
    this.logger.log(`Attempting to create strategy of type: ${type}`);
    // TODO: Implement strategy creation logic
    // For now, we'll just return a dummy strategy

    if (type === 'dummy') {
      this.logger.log(`Successfully created dummy strategy`);
      return {
        name: 'dummy',
        execute: (signal) => {
          this.logger.log(`Executing dummy strategy with signal: ${JSON.stringify(signal)}`);
        },
      };
    }

    this.logger.warn(`Strategy type not found: ${type}`);
    return null;
  }
}
