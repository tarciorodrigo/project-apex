
import { Controller, Post, Body, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataSubscriptionDto } from './dtos/market-data-subscription.dto';

@Controller('market-data')
export class MarketDataController {
  private readonly logger = new Logger(MarketDataController.name);

  constructor(private readonly marketDataService: MarketDataService) {}

  @Post('subscribe')
  @UsePipes(new ValidationPipe({ transform: true }))
  subscribe(@Body() subscriptionDto: MarketDataSubscriptionDto) {
    this.logger.log(`Received subscription request for ${subscriptionDto.pair}`);
    this.marketDataService.subscribeToCandlesticks(subscriptionDto.pair, subscriptionDto.timeframes);
    return { message: 'Subscribed successfully' };
  }

  @Post('unsubscribe')
  @UsePipes(new ValidationPipe({ transform: true }))
  unsubscribe(@Body() subscriptionDto: MarketDataSubscriptionDto) {
    this.logger.log(`Received unsubscription request for ${subscriptionDto.pair}`);
    this.marketDataService.unsubscribeFromCandlesticks(subscriptionDto.pair, subscriptionDto.timeframes);
    return { message: 'Unsubscribed successfully' };
  }
}
