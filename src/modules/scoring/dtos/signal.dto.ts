import { IsNotEmpty, IsString, IsObject, IsOptional, IsNumber } from 'class-validator';

export class SignalDto {
  @IsString()
  @IsNotEmpty()
  strategy: string;

  @IsString()
  @IsNotEmpty()
  pair: string;

  @IsString()
  @IsNotEmpty()
  timeframe: string;

  @IsObject()
  indicators: {
    rsi?: number;
    trendStrength?: number;
    volumeStrength?: number;
    high?: number;
    low?: number;
    close?: number;
  };

  @IsNumber()
  @IsOptional()
  confidence?: number;
}
