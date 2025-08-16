
import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { IndicatorsModule } from '../strategies/indicators.module';
import { StrategiesModule } from '../strategies/strategies.module';

@Module({
  imports: [IndicatorsModule, StrategiesModule],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
