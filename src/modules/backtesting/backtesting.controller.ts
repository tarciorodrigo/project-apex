import { Controller, Post, Body } from '@nestjs/common';
import { BacktestingService } from './backtesting.service';
import { RunBacktestDto } from './dtos/run-backtest.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Backtesting')
@Controller('backtesting')
export class BacktestingController {
  constructor(private readonly backtestingService: BacktestingService) {}

  @Post()
  @ApiOperation({ summary: 'Run a new backtest' })
  @ApiResponse({ status: 200, description: 'The backtest has been successfully executed.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async runBacktest(@Body() runBacktestDto: RunBacktestDto) {
    return this.backtestingService.run(runBacktestDto);
  }
}
