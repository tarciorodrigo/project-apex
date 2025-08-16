import { Module, forwardRef } from '@nestjs/common';
import { BacktestingService } from './backtesting.service';
import { BacktestingController } from './backtesting.controller';
import { ScoringModule } from '../scoring/scoring.module';
import { StrategiesModule } from '../strategies/strategies.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { MtaBacktest } from './mta.backtest';
import { IndicatorsModule } from '../strategies/indicators.module';
import { StrategyEngineModule } from '../strategies/strategy-engine/strategy-engine.module';

@Module({
  imports: [
    ScoringModule,
    forwardRef(() => StrategiesModule),
    MarketDataModule,
    IndicatorsModule,
    StrategyEngineModule,
  ],
  providers: [BacktestingService, MtaBacktest],
  controllers: [BacktestingController],
})
export class BacktestingModule {}
