import { Module } from '@nestjs/common';
import { BacktestingService } from './backtesting.service';
import { BacktestingController } from './backtesting.controller';
import { ScoringModule } from '../scoring/scoring.module';
import { StrategiesModule } from '../strategies/strategies.module';

@Module({
  imports: [ScoringModule, StrategiesModule],
  providers: [BacktestingService],
  controllers: [BacktestingController]
})
export class BacktestingModule {}
