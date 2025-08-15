import { IsNotEmpty, IsString, IsObject, IsOptional, IsNumber } from 'class-validator';

export class SignalDto {
  timeframe: string;
  indicators: {
    rsi?: number;
    trendStrength?: number;
    volumeStrength?: number;
    high?: number;
    low?: number;
    close?: number;
  };
  confidence?: number;
}
