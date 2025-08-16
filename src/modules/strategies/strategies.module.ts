import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MultiTimeframeService } from './services/multi-timeframe.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IndicatorsModule } from './indicators.module';
import { StrategyEngineModule } from './strategy-engine/strategy-engine.module';

@Module({
  imports: [
    CacheModule.register(),
    EventEmitterModule.forRoot(),
    IndicatorsModule,
    StrategyEngineModule,
  ],
  providers: [MultiTimeframeService],
  exports: [MultiTimeframeService, StrategyEngineModule],
})
export class StrategiesModule {}