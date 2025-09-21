import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response';
import { config } from '../config/env';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        ResponseUtils.conflict(res, 'A record with this information already exists');
        return;
      case 'P2025':
        ResponseUtils.notFound(res, 'Record not found');
        return;
      case 'P2003':
        ResponseUtils.conflict(res, 'Foreign key constraint failed');
        return;
      default:
        ResponseUtils.error(res, 'Database error occurred');
        return;
    }
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    ResponseUtils.unauthorized(res, 'Invalid token');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    ResponseUtils.unauthorized(res, 'Token expired');
    return;
  }

  // Validation errors
  if (error.message.includes('Validation error')) {
    ResponseUtils.validationError(res, error.message);
    return;
  }

  // Default error
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : error.message;
    
  ResponseUtils.error(res, message);
};
