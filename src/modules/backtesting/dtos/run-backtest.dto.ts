import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RunBacktestDto {
  @ApiProperty({ example: 'BTCUSDT', description: 'The trading pair to backtest' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ example: '1h', description: 'The timeframe to use for the backtest' })
  @IsString()
  @IsNotEmpty()
  timeframe: string;

  @ApiProperty({ example: 'rsi_strategy', description: 'The name of the strategy to backtest' })
  @IsString()
  @IsNotEmpty()
  strategy: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'The start date for the backtest' })
  @IsDateString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ example: '2023-01-31T23:59:59.999Z', description: 'The end date for the backtest' })
  @IsDateString()
  @IsNotEmpty()
  to: string;
}
