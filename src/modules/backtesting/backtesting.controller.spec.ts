import { Test, TestingModule } from '@nestjs/testing';
import { BacktestingController } from './backtesting.controller';
import { BacktestingService } from './backtesting.service';
import { RunBacktestDto } from './dtos/run-backtest.dto';
import { ScoringService } from '../scoring/scoring.service';
import { IndicatorsService } from '../strategies/services/indicators.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MultiTimeframeService } from '../strategies/services/multi-timeframe.service';
import { MtaBacktest } from './mta.backtest';

describe('BacktestingController', () => {
  let controller: BacktestingController;
  let service: BacktestingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [BacktestingController],
      providers: [
        {
          provide: BacktestingService,
          useValue: {
            run: jest.fn(),
          },
        },
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
            macd: jest.fn(),
            sma: jest.fn(),
            ema: jest.fn(),
          },
        },
        {
          provide: MultiTimeframeService,
          useValue: {
            getAggregatedData: jest.fn(),
          },
        },
        {
          provide: MtaBacktest,
          useValue: {
            run: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BacktestingController>(BacktestingController);
    service = module.get<BacktestingService>(BacktestingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('runBacktest', () => {
    it('should call the backtesting service with the correct parameters', async () => {
      const runBacktestDto: RunBacktestDto = {
        symbol: 'BTCUSDT',
        timeframe: '1h',
        strategy: 'rsi_strategy',
        from: '2023-01-01T00:00:00.000Z',
        to: '2023-01-31T23:59:59.999Z',
      };

      const spy = jest.spyOn(service, 'run');
      await controller.runBacktest(runBacktestDto);

      expect(spy).toHaveBeenCalledWith(runBacktestDto);
    });
  });
});
