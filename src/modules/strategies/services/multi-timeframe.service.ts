
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

interface CandlestickData {
  pair: string;
  timeframe: string;
  data: any; // Replace with a proper type later
}

@Injectable()
export class MultiTimeframeService {
  private readonly logger = new Logger(MultiTimeframeService.name);
  private marketData: Map<string, Map<string, any>> = new Map();

  @OnEvent('marketdata.candlestick')
  handleCandlestickEvent(payload: CandlestickData) {
    const { pair, timeframe, data } = payload;
    if (!this.marketData.has(pair)) {
      this.marketData.set(pair, new Map());
    }
    this.marketData.get(pair).set(timeframe, data);
    this.logger.verbose(`Updated market data for ${pair} on timeframe ${timeframe}`);
  }

  getAggregatedData(pair: string): Map<string, any> {
    return this.marketData.get(pair) || new Map();
  }
}
