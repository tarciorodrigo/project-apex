import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

// Modules
import { HealthModule } from './modules/health/health.module';
import { MarketDataModule } from './modules/market-data/market-data.module';
import { StrategiesModule } from './modules/strategies/strategies.module';
import { RiskManagementModule } from './modules/risk-management/risk-management.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ScoringModule } from './modules/scoring/scoring.module';


// Configuration
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { BacktestingModule } from './modules/backtesting/backtesting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema,
      isGlobal: true,
      cache: true,
    }),
    
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongodb.uri'),
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('database.redis.host'),
          port: configService.get<number>('database.redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    
    ScheduleModule.forRoot(),
    
    // Feature Modules
    HealthModule,
    MarketDataModule,
    StrategiesModule,
    RiskManagementModule,
    OrdersModule,
    NotificationsModule,
    ScoringModule,
    BacktestingModule,
  ],
})
export class AppModule {}
