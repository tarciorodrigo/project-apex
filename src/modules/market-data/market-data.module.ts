import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MarketDataController } from './market-data.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [MarketDataService],
  exports: [MarketDataService],
  controllers: [MarketDataController],
})
export class MarketDataModule {}
