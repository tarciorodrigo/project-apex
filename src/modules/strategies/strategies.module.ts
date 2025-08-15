import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScoringModule } from '../scoring/scoring.module';
import { MultiTimeframeService } from './services/multi-timeframe.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StrategyEngineService } from './services/strategy-engine.service';
import { IndicatorsModule } from './indicators.module';

@Module({
  imports: [CacheModule.register(), forwardRef(() => ScoringModule), EventEmitterModule.forRoot(), IndicatorsModule],
  providers: [MultiTimeframeService, StrategyEngineService],
  exports: [MultiTimeframeService, StrategyEngineService],
})
export class StrategiesModule {}