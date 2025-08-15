import { Injectable } from '@nestjs/common';
import { RunBacktestDto } from './dtos/run-backtest.dto';
import { IndicatorsService } from '../strategies/services/indicators.service';
import { ScoringService } from '../scoring/scoring.service';

@Injectable()
export class BacktestingService {
  constructor(
    private readonly indicatorsService: IndicatorsService,
    private readonly scoringService: ScoringService,
  ) {}

  async run(runBacktestDto: RunBacktestDto) {
    const historicalData = this.getMockHistoricalData();
    const rsiValues = await this.indicatorsService.rsi(historicalData.map(c => c.close), 14);

    let trades = [];
    let position = null; // null | 'long'
    let profit = 0;

    for (let i = 0; i < historicalData.length; i++) {
      if (!rsiValues[i]) continue;

      const signal = {
        timeframe: runBacktestDto.timeframe,
        indicators: {
          rsi: rsiValues[i],
        },
      };

      const { score } = await this.scoringService.calculateMultiTimeframeScore(runBacktestDto.symbol, runBacktestDto.timeframe);

      if (score > 70 && !position) {
        // Buy
        position = 'long';
        trades.push({ entry: historicalData[i].close });
      } else if (score < 30 && position === 'long') {
        // Sell
        const trade = trades[trades.length - 1];
        trade.exit = historicalData[i].close;
        profit += trade.exit - trade.entry;
        position = null;
      }
    }

    const winTrades = trades.filter(t => t.exit > t.entry).length;
    const winRate = trades.length > 0 ? winTrades / trades.length : 0;

    return {
      message: 'Backtest completed successfully',
      ...runBacktestDto,
      profit,
      winRate,
      totalTrades: trades.length,
    };
  }

  private getMockHistoricalData() {
    // Generate some mock candlestick data
    const data = [];
    let close = 100;
    for (let i = 0; i < 200; i++) {
      close += Math.random() * 10 - 5;
      data.push({ open: close, high: close + 5, low: close - 5, close, volume: Math.random() * 1000 });
    }
    return data;
  }
}
