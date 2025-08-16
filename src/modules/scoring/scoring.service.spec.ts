
import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';
import { SignalDto } from './dtos/signal.dto';
import { MultiTimeframeService } from '../strategies/services/multi-timeframe.service';
import { IndicatorsService } from '../strategies/services/indicators.service';

describe('ScoringService', () => {
  let service: ScoringService;
  let multiTimeframeService: MultiTimeframeService;
  let indicatorsService: IndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoringService,
        {
          provide: MultiTimeframeService,
          useValue: {
            getAggregatedData: jest.fn(),
          },
        },
        {
          provide: IndicatorsService,
          useValue: {
            detectDivergence: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
    multiTimeframeService = module.get<MultiTimeframeService>(MultiTimeframeService);
    indicatorsService = module.get<IndicatorsService>(IndicatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return score and confidence', async () => {
    const signal: SignalDto = {
      strategy: 'test',
      pair: 'BTCUSDT',
      timeframe: '5m',
      indicators: { rsi: 50 },
    };
    (multiTimeframeService.getAggregatedData as jest.Mock).mockReturnValue(new Map([['5m', signal]]));
    (indicatorsService.detectDivergence as jest.Mock).mockResolvedValue(null);

    const result = await service.calculateMultiTimeframeScore('BTCUSDT', '5m');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('confidence');
  });
});
