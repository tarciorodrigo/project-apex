import { Test, TestingModule } from '@nestjs/testing';
import { IndicatorsService } from './indicators.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ScoringService } from '../../scoring/scoring.service';

describe('IndicatorsService', () => {
  let service: IndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [IndicatorsService, ScoringService],
    }).compile();

    service = module.get<IndicatorsService>(IndicatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('RSI Calculation', () => {
    it('should calculate RSI correctly', async () => {
      // Sample data: a simple array of rising prices
      const values = [
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
      ];
      const period = 14;
      const rsiResult = await service.rsi(values, period);

      // A precise test would check against known, pre-calculated values.
      // For this example, we'll do some basic validation.
      expect(rsiResult).toBeInstanceOf(Array);
      // The number of results should be the input length minus the period
      expect(rsiResult.length).toBe(values.length - period);
      // With a constantly rising price, the RSI should be 100.
      expect(rsiResult[rsiResult.length - 1]).toBe(100);
    });
  });

  describe('MACD Calculation', () => {
    it('should calculate MACD correctly', async () => {
      // More complex data to get a meaningful MACD
      const values = [
        22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29,
        22.15, 22.39, 22.38, 22.61, 23.36, 24.05, 23.75, 23.83, 23.95, 23.63,
        23.82, 23.87, 23.65, 23.19, 23.1, 23.33, 22.94, 23.33,
      ];
      const macdResult = await service.macd({
        values,
        fastPeriod: 5,
        slowPeriod: 12,
        signalPeriod: 3,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      });

      expect(macdResult).toBeInstanceOf(Array);
      // Check if the result objects have the expected properties
      expect(macdResult[macdResult.length - 1]).toHaveProperty('MACD');
      expect(macdResult[macdResult.length - 1]).toHaveProperty('signal');
      expect(macdResult[macdResult.length - 1]).toHaveProperty('histogram');
    });
  });

  describe('Caching System', () => {
    it('should cache the results of calculations', async () => {
      const values = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      const period = 10;

      // Spy on the RSI.calculate function to see if it's called
      const rsiSpy = jest.spyOn(require('technicalindicators').RSI, 'calculate');

      // First call - should call the original function
      await service.rsi(values, period);
      expect(rsiSpy).toHaveBeenCalledTimes(1);

      // Second call with same parameters - should use cache and not call the original function
      await service.rsi(values, period);
      expect(rsiSpy).toHaveBeenCalledTimes(1); // Should still be 1

      // Third call with different parameters - should call the original function again
      await service.rsi(values, period + 1);
      expect(rsiSpy).toHaveBeenCalledTimes(2);

      rsiSpy.mockRestore(); // Clean up the spy
    });
  });
});
