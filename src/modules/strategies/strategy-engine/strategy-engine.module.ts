import { Module } from '@nestjs/common';
import { StrategyEngineService } from './services/strategy-engine.service';
import { RulesService } from './rules/rules.service';
import { StrategyFactory } from './strategies/strategy.factory';

@Module({
  providers: [StrategyEngineService, RulesService, StrategyFactory],
  exports: [StrategyEngineService, RulesService, StrategyFactory],
})
export class StrategyEngineModule {}
