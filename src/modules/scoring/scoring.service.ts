
import { Injectable } from '@nestjs/common';
import { SignalDto } from './dtos/signal.dto';

// Based on PLANEJAMENTO.md
const defaultConfig = {
  weights: {
    trend: 0.35,
    momentum: 0.25, // RSI could be a momentum indicator
    volume: 0.2,
    support_resistance: 0.2,
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
  calculateScore(signal: SignalDto): number {
    let score = 0;

    // 1. Score Momentum (RSI)
    if (signal.indicators.rsi) {
      // Example: simple linear score for RSI
      // Buy signal: RSI 30-50 -> score 50-100
      // Sell signal: RSI 70-50 -> score 50-100
      const rsi = signal.indicators.rsi;
      let rsiScore = 0;
      if (rsi > 50) { // Potential sell
        rsiScore = Math.max(0, 100 - ( (rsi - 50) * (100 / 20) ) ); // 70->0, 50->100
      } else { // Potential buy
        rsiScore = Math.max(0, ( (rsi - 30) * (100 / 20) ) ); // 30->0, 50->100
      }
      score += rsiScore * defaultConfig.weights.momentum;
    }

    // 2. Score Trend
    if (signal.indicators.trendStrength) {
      // Assuming trendStrength is -1 (strong down) to +1 (strong up)
      const trendScore = (signal.indicators.trendStrength + 1) * 50; // Scale to 0-100
      score += trendScore * defaultConfig.weights.trend;
    }
    
    // 3. Score Volume
    if (signal.indicators.volumeStrength) {
        // Assuming volumeStrength is 0 to N (e.g., 1.5 for 50% above avg)
        // Cap score at 100
        const volumeScore = Math.min(100, signal.indicators.volumeStrength * 50);
        score += volumeScore * defaultConfig.weights.volume;
    }

    // 4. Apply Timeframe Multiplier
    const multiplier = defaultConfig.timeframe_multiplier[signal.timeframe] || 1.0;
    score *= multiplier;

    return Math.round(Math.min(100, score)); // Final score capped at 100
  }
}
