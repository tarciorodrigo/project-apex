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
