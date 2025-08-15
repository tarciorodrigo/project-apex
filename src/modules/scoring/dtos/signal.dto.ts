import { IsNotEmpty, IsString, IsObject, IsOptional, IsNumber } from 'class-validator';

export class SignalDto {
  @IsString()
  @IsNotEmpty()
  timeframe: string;

  @IsObject()
  @IsNotEmpty()
  indicators: {
    rsi?: number;
    trendStrength?: number;
    volumeStrength?: number;
  };

  @IsNumber()
  @IsOptional()
  confidence?: number;
}
