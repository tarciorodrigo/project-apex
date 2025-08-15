import { Test, TestingModule } from '@nestjs/testing';
import { BacktestingService } from './backtesting.service';
import { ScoringService } from '../scoring/scoring.service';
import { IndicatorsService } from '../strategies/services/indicators.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RunBacktestDto } from './dtos/run-backtest.dto';
import { MultiTimeframeService } from '../strategies/services/multi-timeframe.service';

describe('BacktestingService', () => {
  let service: BacktestingService;
  let indicatorsService: IndicatorsService;
  let scoringService: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        BacktestingService,
        {
          provide: ScoringService,
          useValue: {
            calculateMultiTimeframeScore: jest.fn(),
          },
        },
        {
          provide: IndicatorsService,
          useValue: {
            rsi: jest.fn(),
          },
        },
        {
          provide: MultiTimeframeService,
          useValue: {
            getAggregatedData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BacktestingService>(BacktestingService);
    indicatorsService = module.get<IndicatorsService>(IndicatorsService);
    scoringService = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('run', () => {
    it('should run a backtest and return the results', async () => {
      const runBacktestDto: RunBacktestDto = {
        symbol: 'BTCUSDT',
        timeframe: '1h',
        strategy: 'rsi_strategy',
        from: '2023-01-01T00:00:00.000Z',
        to: '2023-01-31T23:59:59.999Z',
      };

      const mockData = [
        { close: 100 }, { close: 110 }, { close: 120 }, { close: 115 }, { close: 105 },
      ];
      const rsiValues = [50, 60, 80, 70, 40];
      const scores = [50, 60, 80, 70, 40].map(v => ({ score: v, confidence: 0.8 }));

      jest.spyOn(service as any, 'getMockHistoricalData').mockReturnValue(mockData);
      (indicatorsService.rsi as jest.Mock).mockResolvedValue(rsiValues);
      (scoringService.calculateMultiTimeframeScore as jest.Mock).mockImplementation(async (pair, timeframe) => {
        return scores[0];
      });

      const result = await service.run(runBacktestDto);

      expect(result.totalTrades).toBe(0);
      expect(result.profit).toBe(0);
      expect(result.winRate).toBe(0);
    });
  });
});
