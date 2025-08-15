import { Test, TestingModule } from '@nestjs/testing';
import { IndicatorsService } from './indicators.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ScoringService } from '../../scoring/scoring.service';
import { MultiTimeframeService } from './multi-timeframe.service';

describe('IndicatorsService', () => {
  let service: IndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        IndicatorsService,
        {
          provide: ScoringService,
          useValue: {
            calculateMultiTimeframeScore: jest.fn(),
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

    service = module.get<IndicatorsService>(IndicatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});