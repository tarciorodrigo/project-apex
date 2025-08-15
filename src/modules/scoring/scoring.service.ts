
import { Injectable } from '@nestjs/common';
import { SignalDto } from './dtos/signal.dto';

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
};

@Injectable()
export class ScoringService {
  calculateScore(signal: SignalDto): { score: number; confidence: number } {
    let score = 0;
    const weights = defaultConfig.weights[signal.timeframe] || defaultConfig.weights['5m'];

    // 1. Score Momentum (RSI)
    if (signal.indicators.rsi) {
      const rsi = signal.indicators.rsi;
      let rsiScore = 0;
      if (rsi > 50) { // Potential sell
        rsiScore = Math.max(0, 100 - ( (rsi - 50) * (100 / 20) ) ); // 70->0, 50->100
      } else { // Potential buy
        rsiScore = Math.max(0, ( (rsi - 30) * (100 / 20) ) ); // 30->0, 50->100
      }
      score += rsiScore * weights.momentum;
    }

    // 2. Score Trend
    if (signal.indicators.trendStrength) {
      const trendScore = (signal.indicators.trendStrength + 1) * 50; // Scale to 0-100
      score += trendScore * weights.trend;
    }
    
    // 3. Score Volume
    if (signal.indicators.volumeStrength) {
        const volumeScore = Math.min(100, signal.indicators.volumeStrength * 50);
        score += volumeScore * weights.volume;
    }

    // 4. Apply Timeframe Multiplier
    const multiplier = defaultConfig.timeframe_multiplier[signal.timeframe] || 1.0;
    score *= multiplier;

    // 5. Calculate Confidence (simple example)
    const confidence = signal.confidence || 0.8; // Static confidence for now

    return {
      score: Math.round(Math.min(100, score)), // Final score capped at 100
      confidence,
    };
  }
}
