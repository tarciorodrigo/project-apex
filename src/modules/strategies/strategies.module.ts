import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { IndicatorsService } from './services/indicators.service';
import { ScoringModule } from '../scoring/scoring.module';

@Module({
  imports: [CacheModule.register(), ScoringModule],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class StrategiesModule {}