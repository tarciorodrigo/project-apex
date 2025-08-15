
import { Module, forwardRef } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { StrategiesModule } from '../strategies/strategies.module';
import { IndicatorsModule } from '../strategies/indicators.module';

@Module({
  imports: [forwardRef(() => StrategiesModule), IndicatorsModule],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
