import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarketDataSubscriptionDto {
  @ApiProperty({
    description: 'The trading pair to subscribe to',
    example: 'BTCUSDT',
  })
  @IsString()
  pair: string;

  @ApiProperty({
    description: 'An array of timeframes to subscribe to',
    example: ['1m', '5m', '15m'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  timeframes: string[];
}
