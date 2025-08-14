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
