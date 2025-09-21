import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

export const createRateLimiter = (windowMs?: number, max?: number) => {
  return rateLimit({
    windowMs: windowMs || config.rateLimit.windowMs,
    max: max || config.rateLimit.maxRequests,
    message: {
      success: false,
      message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const generalRateLimiter = createRateLimiter();
