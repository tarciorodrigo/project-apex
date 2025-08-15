
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

  it('should return a high score for a strong buy signal', () => {
    const signal: SignalDto = {
      timeframe: '5m',
      indicators: {
        rsi: 35, // Oversold -> high score
        trendStrength: 0.8, // Strong uptrend -> high score
        volumeStrength: 1.5, // High volume -> high score
      },
    };

    const score = service.calculateScore(signal);
    // Expected: ( ( (35-30)*(100/20) )*0.25 + ((0.8+1)*50)*0.35 + (1.5*50)*0.2 ) * 1.0
    // Expected: ( 25*0.25 + 90*0.35 + 75*0.2 ) * 1.0
    // Expected: ( 6.25 + 31.5 + 15 ) = 52.75 -> rounded to 53
    expect(score).toBe(53);
  });

  it('should return a low score for a strong sell signal', () => {
    const signal: SignalDto = {
      timeframe: '5m',
      indicators: {
        rsi: 75, // Overbought -> low score
        trendStrength: -0.8, // Strong downtrend -> low score
        volumeStrength: 1.5, // High volume
      },
    };
    const score = service.calculateScore(signal);
    // Expected: ( (100-((75-50)*(100/20)))*0.25 + ((-0.8+1)*50)*0.35 + (1.5*50)*0.2 ) * 1.0
    // Expected: ( (100-125)*0.25 + (10)*0.35 + 75*0.2 ) -> max(0,...) for rsi so 0
    // Expected: ( 0 + 3.5 + 15 ) = 18.5 -> rounded to 19
    expect(score).toBe(19);
  });

  it('should apply the timeframe multiplier correctly', () => {
    const signal: SignalDto = {
      timeframe: '1h', // Multiplier of 2.0
      indicators: {
        rsi: 35,
        trendStrength: 0.8,
        volumeStrength: 1.5,
      },
    };

    const score = service.calculateScore(signal);
    // Expected: 52.75 * 2.0 = 105.5 -> capped at 100 and rounded
    expect(score).toBe(100);
  });

  it('should handle missing indicators gracefully', () => {
    const signal: SignalDto = {
      timeframe: '5m',
      indicators: {
        rsi: 45, // Near neutral
      },
    };
    const score = service.calculateScore(signal);
    // Expected: ( ( (45-30)*(100/20) )*0.25 ) * 1.0
    // Expected: ( 75 * 0.25 ) = 18.75 -> rounded to 19
    expect(score).toBe(19);
  });
});
