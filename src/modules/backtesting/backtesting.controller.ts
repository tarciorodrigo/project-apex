import { Controller, Post, Body } from '@nestjs/common';
import { BacktestingService } from './backtesting.service';
import { RunBacktestDto } from './dtos/run-backtest.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MtaBacktest } from './mta.backtest';

@ApiTags('Backtesting')
@Controller('backtesting')
export class BacktestingController {
  constructor(
    private readonly backtestingService: BacktestingService,
    private readonly mtaBacktest: MtaBacktest,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Run a new backtest' })
  @ApiResponse({ status: 200, description: 'The backtest has been successfully executed.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async runBacktest(@Body() runBacktestDto: RunBacktestDto) {
    return this.backtestingService.run(runBacktestDto);
  }

  @Post('mta')
  @ApiOperation({ summary: 'Run a Multi-Timeframe Analysis backtest' })
  @ApiResponse({ status: 200, description: 'The MTA backtest has been successfully started.' })
  async runMtaBacktest() {
    this.mtaBacktest.run();
    return { message: 'MTA backtest started successfully' };
  }
}
