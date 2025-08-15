
import { Injectable, Logger } from '@nestjs/common';
import { SignalDto } from './dtos/signal.dto';
import { MultiTimeframeService } from '../strategies/services/multi-timeframe.service';
import { IndicatorsService } from '../strategies/services/indicators.service';

// Based on PLANEJAMENTO.md
const defaultConfig = {
  weights: {
    '1m': { trend: 0.2, momentum: 0.4, volume: 0.4 },
    '5m': { trend: 0.35, momentum: 0.25, volume: 0.2, support_resistance: 0.2 },
    '15m': { trend: 0.4, momentum: 0.2, volume: 0.15, support_resistance: 0.25 },
    '1h': { trend: 0.5, momentum: 0.15, volume: 0.1, support_resistance: 0.25 },
    '4h': { trend: 0.6, momentum: 0.1, volume: 0.05, support_resistance: 0.25 },
  },
  minimum_score: 70,
  timeframe_multiplier: {
    '1m': 0.5,
    '5m': 1.0,
    '15m': 1.5,
    '1h': 2.0,
    '4h': 2.5, // Added 4h for completeness
  },
  confirmation_weight: 0.2, // Weight for the confirmation score
  divergence_weight: 0.3, // Weight for the divergence score
};

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    private readonly multiTimeframeService: MultiTimeframeService,
    private readonly indicatorsService: IndicatorsService,
  ) {}

  async calculateMultiTimeframeScore(pair: string, primaryTimeframe: string): Promise<{ score: number; confidence: number }> {
    const aggregatedData = this.multiTimeframeService.getAggregatedData(pair);
    if (!aggregatedData || aggregatedData.size === 0) {
      this.logger.warn(`No market data found for ${pair}. Cannot calculate score.`);
      return { score: 0, confidence: 0 };
    }

    const primarySignal: SignalDto = aggregatedData.get(primaryTimeframe);
    if (!primarySignal) {
      this.logger.warn(`No primary signal found for ${pair} on timeframe ${primaryTimeframe}.`);
      return { score: 0, confidence: 0 };
    }

    let primaryScore = this.calculateSingleTimeframeScore(primarySignal);
    let confirmationScore = 0;
    let confirmationCount = 0;

    for (const [timeframe, signal] of aggregatedData.entries()) {
      if (timeframe !== primaryTimeframe) {
        confirmationScore += this.calculateSingleTimeframeScore(signal as SignalDto);
        confirmationCount++;
      }
    }

    if (confirmationCount > 0) {
      const averageConfirmationScore = confirmationScore / confirmationCount;
      primaryScore = primaryScore * (1 - defaultConfig.confirmation_weight) + averageConfirmationScore * defaultConfig.confirmation_weight;
    }

    // Divergence Detection
    const priceHistory = Array.from(aggregatedData.values()).map((signal: SignalDto) => ({ high: signal.indicators.high, low: signal.indicators.low, close: signal.indicators.close }));
    const rsiHistory = Array.from(aggregatedData.values()).map((signal: SignalDto) => signal.indicators.rsi);
    const divergence = await this.indicatorsService.detectDivergence(priceHistory, rsiHistory);

    let divergenceScore = 0;
    if (divergence) {
      if (divergence.type === 'bullish') {
        divergenceScore = divergence.strength * 100;
      } else {
        divergenceScore = -divergence.strength * 100;
      }
    }

    const scoreWithDivergence = primaryScore * (1 - defaultConfig.divergence_weight) + divergenceScore * defaultConfig.divergence_weight;

    const multiplier = defaultConfig.timeframe_multiplier[primaryTimeframe] || 1.0;
    const finalScore = scoreWithDivergence * multiplier;

    return {
      score: Math.round(Math.min(100, finalScore)),
      confidence: primarySignal.confidence || 0.8,
    };
  }

  private calculateSingleTimeframeScore(signal: SignalDto): number {
    let score = 0;
    const weights = defaultConfig.weights[signal.timeframe] || defaultConfig.weights['5m'];

    if (signal.indicators.rsi) {
      const rsi = signal.indicators.rsi;
      let rsiScore = 0;
      if (rsi > 50) {
        rsiScore = Math.max(0, 100 - ((rsi - 50) * (100 / 20)));
      } else {
        rsiScore = Math.max(0, ((rsi - 30) * (100 / 20)));
      }
      score += rsiScore * weights.momentum;
    }

    if (signal.indicators.trendStrength) {
      const trendScore = (signal.indicators.trendStrength + 1) * 50;
      score += trendScore * weights.trend;
    }

    if (signal.indicators.volumeStrength) {
      const volumeScore = Math.min(100, signal.indicators.volumeStrength * 50);
      score += volumeScore * weights.volume;
    }

    return score;
  }
}
