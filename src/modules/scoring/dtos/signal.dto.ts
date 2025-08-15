
import { IsNotEmpty, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IndicatorValues {
  @IsNumber()
  rsi?: number;

  @IsObject()
  macd?: {
    MACD: number;
    signal: number;
    histogram: number;
  };

  @IsNumber()
  trendStrength?: number; // e.g., from an EMA cross

  @IsNumber()
  volumeStrength?: number; // e.g., volume vs average volume
}

export class SignalDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IndicatorValues)
  indicators: IndicatorValues;

  @IsNotEmpty()
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h';
}
