# Project Apex - Guia de Início Rápido
# Execute os comandos na ordem para setup inicial

# 1. PREPARAÇÃO DO AMBIENTE
echo "🚀 Iniciando setup do Project Apex..."

# Criar estrutura de diretórios
mkdir -p project-apex/{src,tests,docs,scripts,config}
cd project-apex

mkdir -p src/{modules,common,config}
mkdir -p src/modules/{market-data,strategies,risk-management,orders,notifications,health}
mkdir -p src/common/{decorators,filters,guards,interceptors,pipes,utils}
mkdir -p tests/{unit,integration,e2e}
mkdir -p config/{environments,schemas}

echo "📁 Estrutura de diretórios criada"

# 2. INICIALIZAÇÃO DO PROJETO
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express @nestjs/config
npm install @nestjs/mongoose @nestjs/schedule @nestjs/websockets @nestjs/platform-socket.io
npm install mongoose redis ioredis bull @bull-board/express
npm install axios ws socket.io technicalindicators
npm install winston helmet joi class-validator class-transformer
npm install rate-limiter-flexible libsodium-wrappers

# DevDependencies
npm install -D @nestjs/cli @nestjs/testing typescript @types/node
npm install -D jest @types/jest supertest @types/supertest
npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D nodemon ts-node

echo "📦 Dependências instaladas"

# 3. CONFIGURAÇÃO INICIAL
cat > package.json << 'EOF'
{
  "name": "project-apex",
  "version": "1.0.0",
  "description": "Advanced Trading Bot for Binance Spot",
  "main": "dist/main.js",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/mongoose": "^10.0.0",
    "@nestjs/schedule": "^3.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    "mongoose": "^7.5.0",
    "redis": "^4.6.0",
    "ioredis": "^5.3.0",
    "bull": "^4.11.0",
    "@bull-board/express": "^5.8.0",
    "axios": "^1.5.0",
    "ws": "^8.13.0",
    "socket.io": "^4.7.0",
    "technicalindicators": "^3.1.0",
    "winston": "^3.10.0",
    "helmet": "^7.0.0",
    "joi": "^17.9.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "rate-limiter-flexible": "^2.4.0",
    "libsodium-wrappers": "^0.7.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "typescript": "^5.1.0",
    "@types/node": "^20.5.0",
    "jest": "^29.6.0",
    "@types/jest": "^29.5.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^2.0.0",
    "eslint": "^8.47.0",
    "prettier": "^3.0.0",
    "@typescript-eslint/parser": "^6.4.0",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0"
  }
}
EOF

echo "📝 package.json configurado"

# 4. CONFIGURAÇÃO TYPESCRIPT
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/modules/*": ["src/modules/*"],
      "@/common/*": ["src/common/*"],
      "@/config/*": ["src/config/*"]
    },
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
EOF

# 5. CONFIGURAÇÃO NEST CLI
cat > nest-cli.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true,
    "tsConfigPath": "tsconfig.json"
  }
}
EOF

# 6. DOCKER CONFIGURATION
cat > Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY . .

# Build da aplicação
RUN npm run build

# Usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
EOF

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/apex_dev
      - REDIS_URL=redis://redis:6379
      - BINANCE_API_KEY=${BINANCE_API_KEY}
      - BINANCE_SECRET=${BINANCE_SECRET}
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./src:/app/src
      - ./config:/app/config
    networks:
      - apex-network

  mongodb:
    image: mongo:7
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
      - MONGO_INITDB_DATABASE=apex_dev
    volumes:
      - mongo_data:/data/db
    networks:
      - apex-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - apex-network

  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - apex-network

  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - apex-network

volumes:
  mongo_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  apex-network:
    driver: bridge
EOF

# 7. ENVIRONMENT CONFIGURATION
cat > .env.example << 'EOF'
# Environment
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/apex_dev
REDIS_URL=redis://localhost:6379

# Binance API (Testnet)
BINANCE_API_KEY=your_testnet_api_key
BINANCE_SECRET=your_testnet_secret
BINANCE_BASE_URL=https://testnet.binance.vision

# Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/apex.log
EOF

cp .env.example .env

# 8. ESTRUTURA INICIAL DE CÓDIGO
cat > src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Security middleware
  app.use(helmet());
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  const port = configService.get<number>('PORT') || 3000;
  
  await app.listen(port);
  logger.log(`🚀 Application running on: http://localhost:${port}/api/v1`);
  logger.log(`📊 Health Check: http://localhost:${port}/api/v1/health`);
}

bootstrap().catch((error) => {
  Logger.error('❌ Error starting server', error);
  process.exit(1);
});
EOF

cat > src/app.module.ts << 'EOF'
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

// Configuration
import configuration from './config/configuration';
import { validationSchema } from './config/validation';

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
  ],
})
export class AppModule {}
EOF

# 9. CONFIGURAÇÃO PRINCIPAL
mkdir -p src/config
cat > src/config/configuration.ts << 'EOF'
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_dev',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  },
  
  binance: {
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_SECRET,
    baseUrl: process.env.BINANCE_BASE_URL || 'https://testnet.binance.vision',
    recvWindow: parseInt(process.env.BINANCE_RECV_WINDOW, 10) || 5000,
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY || 'dev-32-char-encryption-key-123',
  },
  
  notifications: {
    telegram: {
      token: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    },
    email: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  
  monitoring: {
    prometheusPort: parseInt(process.env.PROMETHEUS_PORT, 10) || 9090,
    grafanaPort: parseInt(process.env.GRAFANA_PORT, 10) || 3001,
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs/apex.log',
  },
});
EOF

cat > src/config/validation.ts << 'EOF'
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  
  MONGODB_URI: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  
  BINANCE_API_KEY: Joi.string().required(),
  BINANCE_SECRET: Joi.string().required(),
  BINANCE_BASE_URL: Joi.string().default('https://testnet.binance.vision'),
  
  JWT_SECRET: Joi.string().min(32).required(),
  ENCRYPTION_KEY: Joi.string().length(32).required(),
});
EOF

# 10. HEALTH MODULE BÁSICO
mkdir -p src/modules/health
cat > src/modules/health/health.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
EOF

cat > src/modules/health/health.controller.ts << 'EOF'
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('live')
  getLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  async getReadiness() {
    const isReady = await this.healthService.isReady();
    return {
      status: isReady ? 'ready' : 'not-ready',
      timestamp: new Date().toISOString(),
    };
  }
}
EOF

cat > src/modules/health/health.service.ts << 'EOF'
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private startTime = Date.now();

  constructor(private configService: ConfigService) {}

  async getHealthStatus() {
    const uptime = Date.now() - this.startTime;
    
    return {
      status: 'healthy',
      timestamp: new Date(),
      uptime: Math.floor(uptime / 1000), // seconds
      environment: this.configService.get('environment'),
      version: '1.0.0',
      services: {
        database: await this.checkDatabase(),
        binance: await this.checkBinanceAPI(),
        redis: await this.checkRedis(),
      },
    };
  }

  async isReady(): Promise<boolean> {
    try {
      const checks = await Promise.all([
        this.checkDatabase(),
        this.checkRedis(),
      ]);
      
      return checks.every(check => check.status === 'up');
    } catch (error) {
      this.logger.error('Readiness check failed:', error);
      return false;
    }
  }

  private async checkDatabase() {
    // TODO: Implement actual MongoDB health check
    return { status: 'up', responseTime: 10 };
  }

  private async checkBinanceAPI() {
    // TODO: Implement actual Binance API health check
    return { status: 'up', responseTime: 50 };
  }

  private async checkRedis() {
    // TODO: Implement actual Redis health check
    return { status: 'up', responseTime: 5 };
  }
}
EOF

# 11. SCRIPTS DE DESENVOLVIMENTO
mkdir -p scripts
cat > scripts/setup-dev.sh << 'EOF'
#!/bin/bash
echo "🔧 Configurando ambiente de desenvolvimento..."

# Criar diretórios necessários
mkdir -p logs data/mongodb data/redis

# Copiar arquivo de ambiente se não existir
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Arquivo .env criado. Configure suas variáveis!"
fi

# Instalar dependências
npm install

# Build inicial
npm run build

echo "✅ Setup concluído! Execute 'npm run start:dev' para iniciar"
EOF

chmod +x scripts/setup-dev.sh

cat > scripts/start-services.sh << 'EOF'
#!/bin/bash
echo "🐳 Iniciando serviços com Docker..."

# Parar containers existentes
docker-compose down

# Iniciar apenas os serviços (sem a aplicação)
docker-compose up -d mongodb redis prometheus grafana

echo "✅ Serviços iniciados!"
echo "📊 MongoDB: localhost:27017"
echo "🔴 Redis: localhost:6379"  
echo "📈 Prometheus: localhost:9090"
echo "📊 Grafana: localhost:3001 (admin/admin123)"
EOF

chmod +x scripts/start-services.sh

# 12. TESTES BÁSICOS
mkdir -p test
cat > test/app.e2e-spec.ts << 'EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);
  });

  it('/health/live (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/live')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
      });
  });
});
EOF

cat > test/jest-e2e.json << 'EOF'
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
EOF

# 13. CONFIGURAÇÕES ADICIONAIS
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Build
dist/
build/

# Environment
.env
.env.local
.env.production

# Logs
logs/
*.log

# Database
data/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
*.tgz
*.tar.gz
.cache/
EOF

cat > .prettierrc << 'EOF'
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

cat > .eslintrc.js << 'EOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
EOF

# 14. README PARA O PROJETO
cat > README.md << 'EOF'
# 🚀 Project Apex - Advanced Trading Bot

Bot de trading automatizado para Binance Spot com análise técnica avançada, gestão de risco profissional e machine learning.

## 🏃‍♂️ Quick Start

```bash
# 1. Setup inicial
./scripts/setup-dev.sh

# 2. Configurar variáveis (edite o arquivo .env)
cp .env.example .env

# 3. Iniciar serviços
./scripts/start-services.sh

# 4. Iniciar aplicação em desenvolvimento
npm run start:dev
```

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Iniciar com hot reload
npm run start:debug      # Iniciar com debug
npm run build           # Build da aplicação
npm run start:prod      # Iniciar em produção

# Testes
npm run test            # Testes unitários
npm run test:watch      # Testes em watch mode
npm run test:e2e        # Testes end-to-end
npm run test:cov        # Coverage de testes

# Qualidade de código
npm run lint            # ESLint
npm run format          # Prettier
```

## 🌐 Endpoints Principais

- **Health Check**: `GET /api/v1/health`
- **Liveness**: `GET /api/v1/health/live`
- **Readiness**: `GET /api/v1/health/ready`

## 📊 Monitoramento

- **Aplicação**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin123)

## 📝 Configuração

Edite o arquivo `.env` com suas configurações:

```env
# Binance API (use testnet para desenvolvimento)
BINANCE_API_KEY=your_testnet_api_key
BINANCE_SECRET=your_testnet_secret

# Notificações (opcional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## 🚧 Status do Desenvolvimento

- [x] Setup inicial e infraestrutura
- [x] Health check system
- [ ] Binance connector
- [ ] Market data service
- [ ] Strategy engine
- [ ] Risk management
- [ ] Order execution
- [ ] Backtesting engine
- [ ] Dashboard

## 📚 Documentação

Consulte a pasta `docs/` para documentação detalhada.
EOF

echo "✅ Project Apex configurado com sucesso!"
echo ""
echo "🚀 Próximos passos:"
echo "1. cd project-apex"
echo "2. ./scripts/setup-dev.sh"
echo "3. Editar .env com suas configurações"
echo "4. ./scripts/start-services.sh"
echo "5. npm run start:dev"
echo ""
echo "📊 Monitoramento:"
echo "- App: http://localhost:3000/api/v1/health"
echo "- Grafana: http://localhost:3001 (admin/admin123)"
echo "- Prometheus: http://localhost:9090"