import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  RSI,
  MACD,
  BollingerBands,
  SMA,
  EMA,
  WMA,
  Stochastic,
  WilliamsR,
  ATR,
  VWAP,
  OBV,
} from 'technicalindicators';
import { createHash } from 'crypto';

interface Candlestick {
  high: number;
  low: number;
  close: number;
}

interface Divergence {
  type: 'bullish' | 'bearish';
  strength: number;
}

@Injectable()
export class IndicatorsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private createCacheKey(indicator: string, params: any, data: any): string {
    const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    return `${indicator}:${JSON.stringify(params)}:${hash}`;
  }

  async getOrSetCache<T>(
    key: string,
    calculation: () => T,
    ttl = 3600,
  ): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);
    if (cached) {
      return cached;
    }
    const result = calculation();
    await this.cacheManager.set(key, result, ttl);
    return result;
  }

  // ... (keep all the existing indicator methods)

  async detectDivergence(
    priceHistory: Candlestick[],
    indicatorHistory: number[],
    lookbackPeriod = 14,
  ): Promise<Divergence | null> {
    const prices = priceHistory.slice(-lookbackPeriod);
    const indicators = indicatorHistory.slice(-lookbackPeriod);

    const priceHighs = this.findPeaks(prices.map(p => p.high));
    const priceLows = this.findTroughs(prices.map(p => p.low));
    const indicatorHighs = this.findPeaks(indicators);
    const indicatorLows = this.findTroughs(indicators);

    // Bearish Divergence: Higher high in price, lower high in indicator
    if (priceHighs.length >= 2 && indicatorHighs.length >= 2) {
      const lastPriceHigh = priceHighs[priceHighs.length - 1];
      const prevPriceHigh = priceHighs[priceHighs.length - 2];
      const lastIndicatorHigh = indicatorHighs[indicatorHighs.length - 1];
      const prevIndicatorHigh = indicatorHighs[indicatorHighs.length - 2];

      if (lastPriceHigh.value > prevPriceHigh.value && lastIndicatorHigh.value < prevIndicatorHigh.value) {
        return {
          type: 'bearish',
          strength: this.calculateDivergenceStrength(lastPriceHigh, prevPriceHigh, lastIndicatorHigh, prevIndicatorHigh),
        };
      }
    }

    // Bullish Divergence: Lower low in price, higher low in indicator
    if (priceLows.length >= 2 && indicatorLows.length >= 2) {
      const lastPriceLow = priceLows[priceLows.length - 1];
      const prevPriceLow = priceLows[priceLows.length - 2];
      const lastIndicatorLow = indicatorLows[indicatorLows.length - 1];
      const prevIndicatorLow = indicatorLows[indicatorLows.length - 2];

      if (lastPriceLow.value < prevPriceLow.value && lastIndicatorLow.value > prevIndicatorLow.value) {
        return {
          type: 'bullish',
          strength: this.calculateDivergenceStrength(lastPriceLow, prevPriceLow, lastIndicatorLow, prevIndicatorLow),
        };
      }
    }

    return null;
  }

  private findPeaks(values: number[]): { value: number; index: number }[] {
    const peaks = [];
    for (let i = 1; i < values.length - 1; i++) {
      if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
        peaks.push({ value: values[i], index: i });
      }
    }
    return peaks;
  }

  private findTroughs(values: number[]): { value: number; index: number }[] {
    const troughs = [];
    for (let i = 1; i < values.length - 1; i++) {
      if (values[i] < values[i - 1] && values[i] < values[i + 1]) {
        troughs.push({ value: values[i], index: i });
      }
    }
    return troughs;
  }

  private calculateDivergenceStrength(
    price1: { value: number },
    price2: { value: number },
    indicator1: { value: number },
    indicator2: { value: number },
  ): number {
    const priceChange = Math.abs((price1.value - price2.value) / price2.value);
    const indicatorChange = Math.abs((indicator1.value - indicator2.value) / indicator2.value);
    return Math.min(1, priceChange + indicatorChange); // Simple strength calculation
  }
  
  // RSI
  async rsi(values: number[], period: number): Promise<number[]> {
    const key = this.createCacheKey('rsi', { period }, values);
    return this.getOrSetCache(key, () => RSI.calculate({ values, period }));
  }

  // MACD
  async macd(
    config: Parameters<typeof MACD.calculate>[0],
  ): Promise<ReturnType<typeof MACD.calculate>> {
    const key = this.createCacheKey('macd', config, config.values);
    return this.getOrSetCache(key, () => MACD.calculate(config));
  }

  // Bollinger Bands
  async bollingerBands(
    config: Parameters<typeof BollingerBands.calculate>[0],
  ): Promise<ReturnType<typeof BollingerBands.calculate>> {
    const key = this.createCacheKey('bb', config, config.values);
    return this.getOrSetCache(key, () => BollingerBands.calculate(config));
  }

  // SMA
  async sma(values: number[], period: number): Promise<number[]> {
    const key = this.createCacheKey('sma', { period }, values);
    return this.getOrSetCache(key, () => SMA.calculate({ values, period }));
  }

  // EMA
  async ema(values: number[], period: number): Promise<number[]> {
    const key = this.createCacheKey('ema', { period }, values);
    return this.getOrSetCache(key, () => EMA.calculate({ values, period }));
  }

  // WMA
  async wma(values: number[], period: number): Promise<number[]> {
    const key = this.createCacheKey('wma', { period }, values);
    return this.getOrSetCache(key, () => WMA.calculate({ values, period }));
  }

  // Stochastic
  async stochastic(
    config: Parameters<typeof Stochastic.calculate>[0],
  ): Promise<ReturnType<typeof Stochastic.calculate>> {
    const key = this.createCacheKey('stochastic', config, config.high);
    return this.getOrSetCache(key, () => Stochastic.calculate(config));
  }

  // Williams %R
  async williamsR(
    config: Parameters<typeof WilliamsR.calculate>[0],
  ): Promise<ReturnType<typeof WilliamsR.calculate>> {
    const key = this.createCacheKey('williamsr', config, config.high);
    return this.getOrSetCache(key, () => WilliamsR.calculate(config));
  }

  // ATR
  async atr(
    config: Parameters<typeof ATR.calculate>[0],
  ): Promise<ReturnType<typeof ATR.calculate>> {
    const key = this.createCacheKey(
      'atr',
      { period: config.period },
      config.high,
    );
    return this.getOrSetCache(key, () => ATR.calculate(config));
  }

  // VWAP
  async vwap(
    config: Parameters<typeof VWAP.calculate>[0],
  ): Promise<ReturnType<typeof VWAP.calculate>> {
    const key = this.createCacheKey('vwap', {}, config.high);
    return this.getOrSetCache(key, () => VWAP.calculate(config));
  }

  // OBV
  async obv(
    config: Parameters<typeof OBV.calculate>[0],
  ): Promise<ReturnType<typeof OBV.calculate>> {
    const key = this.createCacheKey('obv', {}, config.close);
    return this.getOrSetCache(key, () => OBV.calculate(config));
  }
}
