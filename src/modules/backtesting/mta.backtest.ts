
import { Injectable, Logger } from '@nestjs/common';
import { StrategyEngineService } from '../strategies/services/strategy-engine.service';
import { MarketDataService } from '../market-data/market-data.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MtaBacktest {
  private readonly logger = new Logger(MtaBacktest.name);

  constructor(
    private readonly strategyEngine: StrategyEngineService,
    private readonly marketDataService: MarketDataService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async run() {
    this.logger.log('Starting MTA backtest...');

    const pair = 'BTCUSDT';
    const timeframes = ['1m', '5m', '15m'];
    const primaryTimeframe = '5m';

    this.marketDataService.subscribeToCandlesticks(pair, timeframes);

    this.eventEmitter.on('marketdata.candlestick', async (payload) => {
      if (payload.timeframe === primaryTimeframe) {
        const signal = await this.strategyEngine.evaluateSignals(pair, primaryTimeframe);
        // In a real backtest, you would simulate a trade here
        this.logger.log(`[Backtest] New signal for ${pair}: ${signal}`)
      }
    });

    // Let the backtest run for a while
    setTimeout(() => {
        this.logger.log('Stopping MTA backtest...');
        this.marketDataService.unsubscribeFromCandlesticks(pair, timeframes)
    }, 60000 * 5) // 5 minutes
  }
}
