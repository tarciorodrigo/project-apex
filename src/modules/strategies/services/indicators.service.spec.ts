import { Test, TestingModule } from '@nestjs/testing';
import { IndicatorsService } from './indicators.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ScoringService } from '../../scoring/scoring.service';
import { SignalDto } from '../../scoring/dtos/signal.dto';

describe('IndicatorsService', () => {
  let service: IndicatorsService;
  let scoringService: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [IndicatorsService, ScoringService],
    }).compile();

    service = module.get<IndicatorsService>(IndicatorsService);
    scoringService = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSignalScore', () => {
    it('should call the scoring service and return score and confidence', async () => {
      const signal: SignalDto = {
        timeframe: '5m',
        indicators: { rsi: 50 },
      };
      const expectedResult = { score: 13, confidence: 0.8 };
      jest.spyOn(scoringService, 'calculateScore').mockReturnValue(expectedResult);

      const result = await service.getSignalScore(signal);

      expect(scoringService.calculateScore).toHaveBeenCalledWith(signal);
      expect(result).toEqual(expectedResult);
    });
  });
});