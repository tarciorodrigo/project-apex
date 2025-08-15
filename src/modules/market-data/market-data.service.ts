
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as WebSocket from 'ws';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  private sockets: Map<string, WebSocket> = new Map();

  constructor(private eventEmitter: EventEmitter2) {}

  subscribeToCandlesticks(pair: string, timeframes: string[]) {
    this.logger.log(`Subscribing to candlesticks for ${pair} with timeframes: ${timeframes.join(', ')}`);

    for (const timeframe of timeframes) {
      const streamName = `${pair.toLowerCase()}@kline_${timeframe}`;
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`;

      if (this.sockets.has(streamName)) {
        this.logger.warn(`Already subscribed to ${streamName}. Skipping.`);
        continue;
      }

      const ws = new WebSocket(wsUrl);

      ws.on('open', () => {
        this.logger.log(`WebSocket connection opened for ${streamName}`);
      });

      ws.on('message', (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        this.eventEmitter.emit('marketdata.candlestick', {
          pair,
          timeframe,
          data: message.k,
        });
      });

      ws.on('close', () => {
        this.logger.log(`WebSocket connection closed for ${streamName}`);
        this.sockets.delete(streamName);
      });

      ws.on('error', (error) => {
        this.logger.error(`WebSocket error for ${streamName}:`, error);
      });

      this.sockets.set(streamName, ws);
    }
  }

  unsubscribeFromCandlesticks(pair: string, timeframes: string[]) {
    this.logger.log(`Unsubscribing from candlesticks for ${pair} with timeframes: ${timeframes.join(', ')}`);

    for (const timeframe of timeframes) {
      const streamName = `${pair.toLowerCase()}@kline_${timeframe}`;
      if (this.sockets.has(streamName)) {
        const ws = this.sockets.get(streamName);
        ws.close();
        this.sockets.delete(streamName);
      }
    }
  }
}
