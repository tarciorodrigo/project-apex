
import { Injectable, Logger } from '@nestjs/common';
import { ScoringService } from '../../scoring/scoring.service';

export type Signal = 'BUY' | 'SELL' | 'HOLD';

@Injectable()
export class StrategyEngineService {
  private readonly logger = new Logger(StrategyEngineService.name);

  constructor(private readonly scoringService: ScoringService) {}

  async evaluateSignals(pair: string, primaryTimeframe: string): Promise<Signal> {
    const { score, confidence } = await this.scoringService.calculateMultiTimeframeScore(pair, primaryTimeframe);

    this.logger.log(`Evaluating signals for ${pair} on ${primaryTimeframe}. Score: ${score}, Confidence: ${confidence}`);

    if (score > 70 && confidence > 0.75) {
      this.logger.log(`Generated BUY signal for ${pair}`);
      return 'BUY';
    }

    if (score < 30 && confidence > 0.75) {
      this.logger.log(`Generated SELL signal for ${pair}`);
      return 'SELL';
    }

    this.logger.log(`Generated HOLD signal for ${pair}`);
    return 'HOLD';
  }
}
