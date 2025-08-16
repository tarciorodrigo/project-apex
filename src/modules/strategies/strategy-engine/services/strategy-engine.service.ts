import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SignalDto } from '../../../scoring/dtos/signal.dto';
import { RulesService } from '../rules/rules.service';
import { StrategyFactory } from '../strategies/strategy.factory';

@Injectable()
export class StrategyEngineService {
  private readonly logger = new Logger(StrategyEngineService.name);

  constructor(
    private readonly rulesService: RulesService,
    private readonly strategyFactory: StrategyFactory,
  ) {}

  @OnEvent('signal.generated')
  handleSignal(payload: SignalDto) {
    this.logger.log(`New signal received: ${JSON.stringify(payload)}`);
    const rules = this.rulesService.getRules();
    const isValid = rules.every((rule) => rule.validate(payload));

    if (isValid) {
      this.logger.log(`Signal is valid, processing...`);
      const strategy = this.strategyFactory.createStrategy(payload.strategy);
      if (strategy) {
        strategy.execute(payload);
      }
    } else {
      this.logger.log(`Signal is invalid, discarding...`);
    }
  }
}
