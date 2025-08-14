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
