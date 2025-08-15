
import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';
import { SignalDto } from './dtos/signal.dto';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoringService],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return score and confidence', () => {
    const signal: SignalDto = {
      timeframe: '5m',
      indicators: { rsi: 50 },
    };
    const result = service.calculateScore(signal);
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('confidence');
  });

  it('should use the provided confidence if available', () => {
    const signal: SignalDto = {
      timeframe: '5m',
      indicators: { rsi: 50 },
      confidence: 0.95,
    };
    const result = service.calculateScore(signal);
    expect(result.confidence).toBe(0.95);
  });

  it('should use a default confidence if not provided', () => {
    const signal: SignalDto = {
      timeframe: '5m',
      indicators: { rsi: 50 },
    };
    const result = service.calculateScore(signal);
    expect(result.confidence).toBe(0.8);
  });
});
