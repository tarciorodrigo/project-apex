import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { IndicatorsService } from './services/indicators.service';

@Module({
  imports: [CacheModule.register()],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class StrategiesModule {}