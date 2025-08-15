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
import { ScoringService } from '../../scoring/scoring.service';
import { SignalDto } from '../../scoring/dtos/signal.dto';

@Injectable()
export class IndicatorsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private scoringService: ScoringService,
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

  // Example of how to use the scoring service
  async getSignalScore(signal: SignalDto): Promise<{ score: number; confidence: number }> {
    // In a real scenario, you would gather indicator data here
    // and then pass it to the scoring service.
    return this.scoringService.calculateScore(signal);
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
